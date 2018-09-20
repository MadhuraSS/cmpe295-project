package com.test.myapplication;

import android.content.Context;
import android.content.SharedPreferences;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;

import com.github.javiersantos.bottomdialogs.BottomDialog;
import com.google.gson.Gson;
import com.test.myapplication.api.ApiService;
import com.test.myapplication.models.predictions.Predictions;
import com.test.myapplication.models.user.User;

import java.util.concurrent.TimeUnit;

import okhttp3.OkHttpClient;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

/**
 * Created by NehaRege on 11/14/17.
 */
public class PredictionsActivity extends AppCompatActivity implements View.OnClickListener {

    private static final String TAG = "PredictionsActivity";

    private String currentUserEmail;

    private EditText editTextSym1;
    private EditText editTextSym2;
    private EditText editTextSym3;

    private Button buttonSubmit;

    private String sym1;
    private String sym2;
    private String sym3;

    private ApiService service;

    private ProgressBar spinner;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_predictions);

        Log.d(TAG, "onCreate: ");

        initializeViews();


        getSharedPrefs();


        initializeRetrofit();

    }

    private void initializeViews() {
        Log.d(TAG, "initializeViews: ");
        editTextSym1 = (EditText) findViewById(R.id.predictions_activity_symp1);
        editTextSym2 = (EditText) findViewById(R.id.predictions_activity_symp2);
//        editTextSym3 = (EditText) findViewById(R.id.predictions_activity_symp3);

        buttonSubmit = (Button) findViewById(R.id.predictions_activity_submit);
        buttonSubmit.setOnClickListener(this);

        spinner = (ProgressBar) findViewById(R.id.predictions_progressBar);
        spinner.setVisibility(View.INVISIBLE);
    }


    @Override
    public void onClick(View view) {

        switch (view.getId()) {
            case R.id.predictions_activity_submit:
                Log.d(TAG, "onClick: submit predictions");
                spinner.setVisibility(View.VISIBLE);


                getPredictions("neharege28@gmail.com", getDataFromEditText());
//                openBottomDialog();

//                getPredictions("weight loss,tired", "jesantos0527@gmail.com");

                break;
        }

    }

    private String getDataFromEditText() {
        String sym1 = editTextSym1.getText().toString().trim().toLowerCase();
        String sym2 = editTextSym2.getText().toString().trim().toLowerCase();

        return sym1+","+sym2;

    }

    private void openBottomDialog(String diseaseName, String diseaseDescription) {
        new BottomDialog.Builder(this)
                .setTitle(diseaseName)
                .setContent(diseaseDescription)
                .setPositiveText("OK")
                .setPositiveBackgroundColorResource(R.color.colorPrimary)
                //.setPositiveBackgroundColor(ContextCompat.getColor(this, R.color.colorPrimary)
                .setPositiveTextColorResource(android.R.color.white)
                //.setPositiveTextColor(ContextCompat.getColor(this, android.R.color.colorPrimary)
                .onPositive(new BottomDialog.ButtonCallback() {
                    @Override
                    public void onClick(BottomDialog dialog) {
                        Log.d("BottomDialogs", "Do something!");
                    }
                })
                .setCancelable(false)
                .show();
    }

    private void getSharedPrefs() {
        SharedPreferences prefs = getSharedPreferences(MainActivity.KEY_SHARED_PREFS_USER_GMAIL, Context.MODE_PRIVATE);
        currentUserEmail = prefs.getString(getString(R.string.shared_pref_gmail), null);
        Log.d(TAG, "getSharedPrefs: email = " + currentUserEmail);

    }

//    private OkHttpClient getClient() {
//        OkHttpClient client = new OkHttpClient.Builder()
//                .connectTimeout(5, TimeUnit.MINUTES)
//                .readTimeout(5, TimeUnit.MINUTES)
//                .build();
//        return client;
//    }

    private void initializeRetrofit() {

        OkHttpClient client = new OkHttpClient.Builder()
                .connectTimeout(100, TimeUnit.SECONDS)
                .readTimeout(100, TimeUnit.SECONDS).build();

        Log.d(TAG, "initializeRetrofit: ");
        String BASE_URL = "https://remote-health-api.herokuapp.com";
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(BASE_URL).client(client)
                .addConverterFactory(GsonConverterFactory.create(new Gson()))
                .build();

        service = retrofit.create(ApiService.class);
    }

    /*
        https://remote-health-api.herokuapp.com/api/prediction?symptoms=weight%20loss,tired&email=jesantos0527@gmail.com
     */

    private void getPredictions(String emailId, String symptoms) {
        Log.d(TAG, "getPredictions: method");

        Call<Predictions> call = service.getPredictions(symptoms, emailId);
        Log.d(TAG, "getPredictions: will enter call.enque");

        call.enqueue(new Callback<Predictions>() {
            @Override
            public void onResponse(Call<Predictions> call, Response<Predictions> response) {
                try {
                    Log.d(TAG, "onResponse: ");
                    if (response == null) {
                        Log.d(TAG, "onResponse: response = null");
                    } else {
                        spinner.setVisibility(View.INVISIBLE);

                        openBottomDialog(response.body().getDisease().toUpperCase(), response.body().getDescription());
                        Log.d(TAG, "onResponse: response = " + response.body());

                    }
//                    Log.d(TAG, "onResponse: description = " + response.body().getDescription());
//                    Log.d(TAG, "onResponse: disease = " + response.body().getDisease());

                } catch (Exception e) {
                    Log.d(TAG, "onResponse: exception = " + e);
                    e.printStackTrace();
                }
            }

            @Override
            public void onFailure(Call<Predictions> call, Throwable t) {
                t.printStackTrace();
                Log.d(TAG, "onFailure: Retrofit call failed: " + t);
            }
        });

    }
}
