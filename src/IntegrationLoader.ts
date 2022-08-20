import { ILibConfig, IntegrationPurpose } from "./types";

import Integration from "./integrations/Integration";
import { MAX_INTEGRATION_LOAD_TIMEOUT } from "./constants";
import { Logger } from "./logger";

export default class IntegrationLoader {
  isRequireLoaded: boolean = false;
  onRequireLoaded: any[] = [];
  loadedIntegrations: { [key: string]: Integration } = {};

  constructor() {
    (async () => {
      const requireScript = document.createElement("script");
      requireScript.src =
        "https://requirejs.org/docs/release/2.3.6/minified/require.js";
      requireScript.onload = async () => {
        this.isRequireLoaded = true;
        for (const callback of this.onRequireLoaded) {
          await callback();
        }
      };
      document.body.appendChild(requireScript);
    })();
  }

  public async loadIntegrations(
    libs: ILibConfig[],
    requestId: string
  ): Promise<Integration[]> {
    return new Promise((resolve) => {
      let integrationsMap: { [key: string]: Integration } = {};
      let resolvedCount = 0;

      const timeoutHandle = setTimeout(() => {
        Logger.error(
          `Timeout loading integrations. Integrations took longer than ${MAX_INTEGRATION_LOAD_TIMEOUT}ms to load. Resolving successfully loaded integrations.`
        ).log();
        resolve(Object.values(integrationsMap));
      }, MAX_INTEGRATION_LOAD_TIMEOUT);

      const onIntegrationLoaded = (integration: Integration | null) => {
        resolvedCount += 1;
        if (integration !== null) {
          integrationsMap[integration.name] = integration;
        }

        if (libs.length === resolvedCount) {
          // All of the integrations have been loaded
          clearTimeout(timeoutHandle);
          Logger.info(`All integrations successfully loaded.`).log();
          resolve(Object.values(integrationsMap));
        }
      };

      libs.forEach((libConfig) => {
        this.loadIntegration(libConfig, requestId).then(onIntegrationLoaded);
      });
    });
  }

  public async loadIntegration(
    libConfig: ILibConfig,
    requestId: string
  ): Promise<Integration | null> {
    let integration: Integration;

    // Check if the integration has already been loaded.
    // If so, return the existing integration.
    if (this.loadedIntegrations.hasOwnProperty(libConfig.name)) {
      try {
        Logger.info(`Integration already loaded: ${libConfig.name}`).log();
        integration = this.loadedIntegrations[libConfig.name];
        Logger.info(`Reconfiguring integration: ${libConfig.name}`).log();
        await integration.reconfigure({ ...libConfig, requestId });
        return integration;
      } catch (error) {
        Logger.error(
          `Error loading integration: ${libConfig.name}`,
          error
        ).log();
        return null;
      }
    } else {
      const _loadIntegration = (resolve: any, reject: any) => {
        try {
          // Dynamically load the integration content
          if (libConfig.content != null) {
            const integrationScript = document.createElement("script");

            const onIntegrationContentReady = async () => {
              (window as any).require(
                [`integrations/${libConfig.name}`],
                () => {
                  let integrationClass: Integration;

                  integrationClass = (window as any)._dodgeball_integrations[
                    libConfig.name
                  ];

                  if (integrationClass != null) {
                    Logger.info(
                      `Integration class found for: ${libConfig.name}`
                    ).log();

                    integration = new (integrationClass as any)({
                      ...libConfig,
                      requestId,
                    });

                    (async () => {
                      if (!integration.hasLoaded()) {
                        Logger.info(
                          `Loading integration dependencies: ${libConfig.name}`
                        ).log();
                        await integration.load();
                      }
                      Logger.info(
                        `Configuring integration: ${libConfig.name}`
                      ).log();
                      await integration.configure();
                      this.loadedIntegrations[libConfig.name] = integration;
                      resolve(integration);
                    })();
                  } else {
                    Logger.error(
                      `No integration class found for: ${libConfig.name}`
                    );
                    resolve(integration);
                  }
                }
              );
            };

            if (libConfig.content.url) {
              integrationScript.src = libConfig.content.url;
              integrationScript.onload = onIntegrationContentReady;
            } else {
              integrationScript.innerHTML = libConfig.content.text as string;
              setTimeout(onIntegrationContentReady, 2);
            }
            document.body.appendChild(integrationScript);
          } else {
            Logger.error(`No integration content: ${libConfig.name}`).log();
            resolve(null);
          }
        } catch (error) {
          Logger.error(
            `Error loading integration: ${libConfig.name}`,
            error
          ).log();
          resolve(null);
        }
      };

      return new Promise((resolve, reject) => {
        if (this.isRequireLoaded) {
          _loadIntegration(resolve, reject);
        } else {
          this.onRequireLoaded.push(() => {
            _loadIntegration(resolve, reject);
          });
        }
      });
    }
  }

  public filterIntegrationsByPurpose(
    integrations: Integration[],
    purpose: IntegrationPurpose
  ): Integration[] {
    return integrations.filter(
      (integration) => integration.purposes.indexOf(purpose) > -1
    );
  }
}
