package com.example.assignment2; // Keep your actual package name here

import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends AppCompatActivity {

    private WebView myWebView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // 1. Initialize WebView
        myWebView = findViewById(R.id.webview);

        // 2. Configure Settings
        WebSettings webSettings = myWebView.getSettings();
        webSettings.setJavaScriptEnabled(true); // Enable JS for API calls

        // CRITICAL FOR ASSIGNMENT: Enable LocalStorage
        webSettings.setDomStorageEnabled(true);

        // 3. Ensure links open within the App, not Chrome
        myWebView.setWebViewClient(new WebViewClient());

        // 4. Load the HTML file from the assets folder
        myWebView.loadUrl("file:///android_asset/index.html");
    }

    // Optional: Allow the "Back" button to navigate history inside the WebView
    @Override
    public void onBackPressed() {
        if (myWebView.canGoBack()) {
            myWebView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}