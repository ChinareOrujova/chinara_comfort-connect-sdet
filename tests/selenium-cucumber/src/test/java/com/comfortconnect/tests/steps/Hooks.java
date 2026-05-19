package com.comfortconnect.tests.steps;

import com.comfortconnect.tests.utils.DriverManager;
import com.comfortconnect.tests.utils.TestConfig;
import io.cucumber.java.After;
import io.cucumber.java.AfterAll;
import io.cucumber.java.Before;
import io.cucumber.java.BeforeAll;
import io.cucumber.java.BeforeStep;
import io.cucumber.java.Scenario;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;

import java.io.File;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.file.Files;

public class Hooks {

    private static Process appProcess;

    @BeforeAll
    public static void startAppIfNeeded() throws IOException, InterruptedException {
        if (isServerUp()) return;

        // Locate the project root (3 levels up from tests/selenium-cucumber)
        File projectRoot = new File(System.getProperty("user.dir"))
                .getParentFile().getParentFile();

        ProcessBuilder pb = new ProcessBuilder("npm", "run", "dev")
                .directory(projectRoot);
        // Prevent React dev server from auto-opening a browser tab
        pb.environment().put("BROWSER", "none");
        // Redirect output to a log file — inheritIO() corrupts surefire's JVM channel
        File logFile = new File(System.getProperty("user.dir"), "target/app-server.log");
        Files.createDirectories(logFile.getParentFile().toPath());
        pb.redirectOutput(logFile);
        pb.redirectErrorStream(true);
        appProcess = pb.start();

        // Wait up to 60 seconds for the frontend to become available
        for (int i = 0; i < 60; i++) {
            Thread.sleep(1000);
            if (isServerUp()) return;
        }
        throw new RuntimeException("App server did not start within 60 seconds");
    }

    @AfterAll
    public static void stopAppIfStarted() {
        if (appProcess != null && appProcess.isAlive()) {
            appProcess.descendants().forEach(ProcessHandle::destroy);
            appProcess.destroy();
            appProcess = null;
        }
    }

    private static boolean isServerUp() {
        try {
            HttpURLConnection conn = (HttpURLConnection) new URL(TestConfig.BASE_URL).openConnection();
            conn.setConnectTimeout(1000);
            conn.setReadTimeout(1000);
            conn.connect();
            conn.disconnect();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @BeforeStep
    public void slowDown() throws InterruptedException {
        if (TestConfig.STEP_DELAY_MS > 0) {
            Thread.sleep(TestConfig.STEP_DELAY_MS);
        }
    }

    @Before
    public void setUp() {
        DriverManager.initDriver();
        DriverManager.getDriver().get(TestConfig.BASE_URL);
    }

    @After
    public void tearDown(Scenario scenario) {
        if (scenario.isFailed()) {
            byte[] screenshot = ((TakesScreenshot) DriverManager.getDriver())
                .getScreenshotAs(OutputType.BYTES);
            scenario.attach(screenshot, "image/png", "failure-screenshot");
        }
        DriverManager.quitDriver();
    }
}
