import {
  MfaConfigurableStyle,
  ConfigurableFontWeight,
  DodgeballApiVersion,
  IDodgeballConfig,
  IVerificationInvocationOptions,
} from "./types";

export const MIN_TOKEN_REFRESH_INTERVAL_MS = 30 * 60 * 1000;
export const MAX_INTEGRATION_LOAD_TIMEOUT = 2 * 1000;

export const DEFAULT_CONFIG: IDodgeballConfig = {
  apiUrl: "https://api.dodgeballhq.com/",
  apiVersion: DodgeballApiVersion.v1,
};

export const DEFAULT_VERIFICATION_OPTIONS: IVerificationInvocationOptions = {
  maxDuration: 24 * 60 * 60 * 1000, // Wait 24 hrs before failing
  pollingInterval: 100,
  numAtInitialPollingInterval: 3, // How many times at the initial polling interval to try before using exponential back-off
  maxPollingInterval: 10 * 60 * 1000, // 10 seconds
};

export const DEFAULT_STYLES: { [key in MfaConfigurableStyle]: string } = {
  MODAL_BORDER_RADIUS: "6px",
  MODAL_BACKGROUND_COLOR: "#FFFFFF",
  HEADER_BACKGROUND_COLOR: "#112233",
  HEADER_TITLE_TEXT: "Extra Security for Your Protection",
  HEADER_LOGO: "",
  HEADER_TEXT_COLOR: "#FFFFFF",
  HEADER_TEXT_SIZE: "24px",
  HEADER_TEXT_WEIGHT: ConfigurableFontWeight.LIGHT,
  HEADER_UNDERLINE_COLOR: "#EEAA00",
  HEADER_UNDERLINE_THICKNESS: "0px",
  CONTENT_TITLE_TEXT: "Verify Your Identity",
  CONTENT_TITLE_COLOR: "#555555",
  CONTENT_TITLE_SIZE: "24px",
  CONTENT_TITLE_WEIGHT: ConfigurableFontWeight.LIGHT,
  CONTENT_SUBTITLE_COLOR: "#555555",
  CONTENT_SUBTITLE_SIZE: "16px",
  CONTENT_SUBTITLE_WEIGHT: ConfigurableFontWeight.SEMI_BOLD,
  CONTENT_VERIFIED_TITLE_TEXT: "Identity Verification Complete",
  CONTENT_VERIFIED_SUBTITLE_TEXT: "Identity Verified",
  CONTENT_AUTHORIZE_TEXT: "Request Authorization Code",
  CONTENT_VERIFY_TEXT: "Enter Authorization Code",
  CONTENT_DESCRIPTION_COLOR: "#555555",
  CONTENT_DESCRIPTION_SIZE: "14px",
  CONTENT_DESCRIPTION_WEIGHT: ConfigurableFontWeight.LIGHT,
  CONTENT_EXPLANATION_TEXT:
    "To verify your identity we need to send you a one-time authorization code.",
  CONTENT_DISCLAIMER_TEXT:
    "The code expires 10 minutes after you request it. You are consenting to be contacted for the purpose of receiving an authorization code. Fees from your carrier may apply.",
  CONTENT_PROMPT_TEXT: "An authorization code was sent to:",
  CONTENT_CODE_INPUT_LABEL_TEXT_COLOR: "#333333",
  CONTENT_CODE_INPUT_LABEL_TEXT_SIZE: "12px",
  CONTENT_CODE_INPUT_LABEL_TEXT_WEIGHT: ConfigurableFontWeight.SEMI_BOLD,
  CONTENT_CODE_INPUT_BORDER_RADIUS: "6px",
  CONTENT_CODE_INPUT_BORDER_COLOR: "#DDDDDD",
  CONTENT_CODE_INPUT_BORDER_THICKNESS: "2px",
  CONTENT_CODE_INPUT_TEXT_COLOR: "#333333",
  CONTENT_CODE_INPUT_TEXT_SIZE: "14px",
  CONTENT_CODE_INPUT_TEXT_WEIGHT: ConfigurableFontWeight.REGULAR,
  CONTENT_CODE_INPUT_VERTICAL_PADDING: "8px",
  CONTENT_CODE_INPUT_HORIZONTAL_PADDING: "15px",
  CONTENT_OPTION_TEXT_COLOR: "#333333",
  CONTENT_OPTION_TEXT_SIZE: "14px",
  CONTENT_OPTION_TEXT_WEIGHT: ConfigurableFontWeight.MEDIUM,
  CONTENT_HELP_LINK_COLOR: "#2277CC",
  CONTENT_HELP_LINK_HOVER_COLOR: "#0093FF",
  CONTENT_HELP_LINK_SIZE: "14px",
  CONTENT_HELP_LINK_WEIGHT: ConfigurableFontWeight.LIGHT,
  CONTENT_RESEND_CODE_TEXT: "Request another authorization code",
  CONTENT_BORDER_THICKNESS: "2px",
  CONTENT_BORDER_COLOR: "#DDDDDD",
  BUTTON_TEXT_SIZE: "14px",
  BUTTON_TEXT_WEIGHT: ConfigurableFontWeight.MEDIUM,
  BUTTON_GAP: "15px",
  BUTTON_BORDER_RADIUS: "6px",
  BUTTON_BORDER_THICKNESS: "2px",
  BUTTON_HORIZONTAL_PADDING: "30px",
  BUTTON_VERTICAL_PADDING: "8px",
  CANCEL_BUTTON_COLOR: "#FFFFFF",
  CANCEL_BUTTON_TEXT_COLOR: "#333333",
  CANCEL_BUTTON_BORDER_COLOR: "#DDDDDD",
  CANCEL_BUTTON_HOVER_COLOR: "#FFFFFF",
  CANCEL_BUTTON_HOVER_TEXT_COLOR: "#000000",
  CANCEL_BUTTON_HOVER_BORDER_COLOR: "#333333",
  SUBMIT_BUTTON_COLOR: "#2277CC",
  SUBMIT_BUTTON_TEXT_COLOR: "#FFFFFF",
  SUBMIT_BUTTON_BORDER_COLOR: "#2277CC",
  SUBMIT_BUTTON_HOVER_COLOR: "#005599",
  SUBMIT_BUTTON_HOVER_TEXT_COLOR: "#FFFFFF",
  SUBMIT_BUTTON_HOVER_BORDER_COLOR: "#005599",
  DISABLED_BUTTON_COLOR: "#FFFFFF",
  DISABLED_BUTTON_TEXT_COLOR: "#999999",
  DISABLED_BUTTON_BORDER_COLOR: "#DDDDDD",
  SHOW_COMPLETE_SCREEN: "false",
  COMPLETE_AUTO_CLOSE_DELAY: "3000",
};
