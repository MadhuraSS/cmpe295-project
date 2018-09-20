package com.test.myapplication;

import android.app.Activity;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.widget.LinearLayout;

import com.uber.sdk.android.core.UberSdk;
import com.uber.sdk.android.rides.RideParameters;
import com.uber.sdk.android.rides.RideRequestActivityBehavior;
import com.uber.sdk.android.rides.RideRequestButton;
import com.uber.sdk.core.auth.Scope;
import com.uber.sdk.rides.client.SessionConfiguration;

import java.util.Arrays;

/**
 * Created by NehaRege on 10/19/17.
 */
public class UberActivity extends AppCompatActivity {

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_uber);

        if(getActionBar() != null) {
            getActionBar().setDisplayHomeAsUpEnabled(true);
        }

        uberSetup();

    }

    private void uberSetup() {
        uberConfig();

        RideRequestButton rideRequestButton = new RideRequestButton(UberActivity.this);
        LinearLayout layout = (LinearLayout) findViewById(R.id.uber_linear);
        layout.addView(rideRequestButton);
        Activity activity = this;
        int requestCode = 1234;
        rideRequestButton.setRequestBehavior(new RideRequestActivityBehavior(activity, requestCode));

        RideParameters rideParams = new RideParameters.Builder()
                .setProductId("a1111c8c-c720-46c3-8534-2fcdd730040d")
                .setPickupLocation(37.775304, -122.417522, "Uber HQ", "1455 Market Street, San Francisco")
                .setDropoffLocation(37.795079, -122.4397805, "Embarcadero", "One Embarcadero Center, San Francisco")
                .build();
        rideRequestButton.setRideParameters(rideParams);







    }

    private void uberConfig() {
        SessionConfiguration config = new SessionConfiguration.Builder()
                // mandatory
                .setClientId("yk6wfbTmXZiXndWmzASMX6MiYT-mI2CQ")
                // required for enhanced button features
                .setServerToken("9DSnlyJYB9XE0hW9JrySkjD7rhqLffE5jvgN2993")
                // required for implicit grant authentication
                .setRedirectUri("yk6wfbTmXZiXndWmzASMX6MiYT-mI2CQ://uberConnect")
                // required scope for Ride Request Widget features
                .setScopes(Arrays.asList(Scope.RIDE_WIDGETS))
                // optional: set sandbox as operating environment
                .setEnvironment(SessionConfiguration.Environment.SANDBOX)
                .build();

        UberSdk.initialize(config);
    }
}
