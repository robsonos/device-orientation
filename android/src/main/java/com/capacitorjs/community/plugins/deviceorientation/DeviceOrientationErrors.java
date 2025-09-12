package com.capacitorjs.community.plugins.deviceorientation;

public class DeviceOrientationErrors {

    public static class ErrorInfo {
        public final String code;
        public final String message;

        ErrorInfo(String code, String message) {
            this.code = code;
            this.message = message;
        }
    }

    private static String formatErrorCode(Integer number) {
        return "DEV-ORI-" + String.format("%0" + 4 + "d", number);
    }

    public static final ErrorInfo LISTENER_START_FAILED = new ErrorInfo(
            formatErrorCode(1),
            "Failed to start the device orientation listener.");

    public static final ErrorInfo WATCH_ID_NOT_FOUND = new ErrorInfo(
            formatErrorCode(2),
            "Watch ID not found.");

    public static final ErrorInfo WATCH_ID_NOT_PROVIDED = new ErrorInfo(
            formatErrorCode(3),
            "watchId must be provided.");
}
