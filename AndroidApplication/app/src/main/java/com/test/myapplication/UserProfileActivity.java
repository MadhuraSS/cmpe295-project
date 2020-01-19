package com.test.myapplication;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.NavUtils;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.MenuItem;
import android.widget.ImageView;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.TextView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.RequestOptions;
import com.test.myapplication.api.ApiService;
import com.test.myapplication.models.user.User;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

/**
 * Created by NehaRege on 10/19/17.
 */
public class UserProfileActivity extends AppCompatActivity {

    private static final String TAG = "UserProfileActivity";

    private String currentUserEmail;
    private String currentUserSharedPrefsPhoto;
    private String currentUserSharedPrefsName;

    private ImageView imageViewPhoto;

    private TextView textViewName;
    private TextView textViewGender;
    private TextView textViewLocation;
    private TextView textViewDob;
    private TextView textViewEthnicity;
    private TextView textViewAge;
    private TextView textViewUserType;
    private TextView textViewEmail;
    private TextView textViewNumber;
    private TextView textViewDoctor;

    private TextView textViewAlcohol;
    private TextView textViewBleeding;
    private TextView textViewCancer;
    private TextView textViewDiabetes;
    private TextView textViewEpilepsy;
    private TextView textViewBp;
    private TextView textViewHeartDisease;
    private TextView textViewMigraine;

//    private RadioGroup radioGroupAlcohol;
//    private RadioGroup radioGroupBleeding;
//    private RadioGroup radioGroupCancer;
//    private RadioGroup radioGroupDiabetes;
//    private RadioGroup radioGroupEpilepsy;
//    private RadioGroup radioGroupBp;
//    private RadioGroup radioGroupHeart;
//    private RadioGroup radioGroupMigraine;
//    private RadioGroup radioGroupGender;

//    private RadioButton radioButtonAlcohol;
//    private RadioButton radioButtonBleeding;
//    private RadioButton radioButtonCancer;
//    private RadioButton radioButtonDiabetes;
//    private RadioButton radioButtonEpilepsy;
//    private RadioButton radioButtonBp;
//    private RadioButton radioButtonHeart;
//    private RadioButton radioButtonMigraine;
//    private RadioButton radioButtonIsFemale;

    private String photoUrl;

    private ApiService service;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_profile);

        if (getActionBar() != null) {
            getActionBar().setDisplayHomeAsUpEnabled(true);
        }

        getSharedPrefs();

        Intent intent = getIntent();
        photoUrl = intent.getStringExtra("user_photo");
//        currentUserEmail = intent.getStringExtra("user_profile_email");

        initializeViews();

        initializeRetrofit();

        setUserPhoto();

        getUserInfoApi(currentUserEmail);

    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                NavUtils.navigateUpFromSameTask(this);
                return true;
        }
        return super.onOptionsItemSelected(item);
    }

    private void getSharedPrefs() {
        SharedPreferences prefs = getSharedPreferences(MainActivity.KEY_SHARED_PREFS_USER_GMAIL, Context.MODE_PRIVATE);
        currentUserEmail = prefs.getString(getString(R.string.shared_pref_gmail), null);
        currentUserSharedPrefsName = prefs.getString(getString(R.string.shared_pref_gmail_name), null);
        currentUserSharedPrefsPhoto = prefs.getString(getString(R.string.shared_pref_gmail_photo), null);
    }

    private void initializeViews() {

        imageViewPhoto = (ImageView) findViewById(R.id.user_profile_activity_photo);

        textViewName = (TextView) findViewById(R.id.user_profile_activity_name);
        textViewGender = (TextView) findViewById(R.id.user_profile_activity_gender);
//        radioGroupGender = (RadioGroup) findViewById(R.id.profile_activity_radio_group_gender);
        textViewLocation = (TextView) findViewById(R.id.user_profile_activity_location);
        textViewDob = (TextView) findViewById(R.id.user_profile_activity_dob);
        textViewEthnicity = (TextView) findViewById(R.id.user_profile_activity_ethnicity);
        textViewAge = (TextView) findViewById(R.id.user_profile_activity_age);
        textViewUserType = (TextView) findViewById(R.id.user_profile_activity_user_type);
        textViewEmail = (TextView) findViewById(R.id.user_profile_activity_email);
        textViewNumber = (TextView) findViewById(R.id.user_profile_activity_number);
        textViewDoctor = (TextView) findViewById(R.id.user_profile_activity_doctor);


        textViewAlcohol = (TextView) findViewById(R.id.user_profile_activity_text_view_alcohol);
        textViewBleeding = (TextView) findViewById(R.id.user_profile_activity_text_view_bleeding);
        textViewCancer = (TextView) findViewById(R.id.user_profile_activity_text_view_cancer);
        textViewDiabetes = (TextView) findViewById(R.id.user_profile_activity_text_view_diabetes);
        textViewEpilepsy = (TextView) findViewById(R.id.user_profile_activity_text_view_epilepsy);
        textViewBp = (TextView) findViewById(R.id.user_profile_activity_text_view_bp);
        textViewHeartDisease = (TextView) findViewById(R.id.user_profile_activity_text_view_heart_disease);
        textViewMigraine = (TextView) findViewById(R.id.user_profile_activity_text_view_migraine);

//        radioGroupAlcohol = (RadioGroup) findViewById(R.id.profile_activity_radio_group_alcohol);
//        radioGroupBleeding = (RadioGroup) findViewById(R.id.profile_activity_radio_group_bleeding);
//        radioGroupCancer = (RadioGroup) findViewById(R.id.profile_activity_radio_group_cancer);
//        radioGroupDiabetes = (RadioGroup) findViewById(R.id.profile_activity_radio_group_diabetes);
//        radioGroupEpilepsy = (RadioGroup) findViewById(R.id.profile_activity_radio_group_epilepsy);
//        radioGroupBp = (RadioGroup) findViewById(R.id.profile_activity_radio_group_bp);
//        radioGroupHeart = (RadioGroup) findViewById(R.id.profile_activity_radio_group_heart);
//        radioGroupMigraine = (RadioGroup) findViewById(R.id.profile_activity_radio_group_migraine);

    }

    private void setUserPhoto() {
        if (photoUrl != null) {
            Glide.with(this)
                    .load(photoUrl)
                    .apply(RequestOptions.circleCropTransform())
                    .into(imageViewPhoto);
        }

        Glide.with(this)
                .load(currentUserSharedPrefsPhoto)
                .apply(RequestOptions.circleCropTransform())
                .into(imageViewPhoto);
    }

    private void setUserDetails(User currentUserInfo) {
        textViewName.setText(currentUserInfo.getName().getFirstName());
        textViewLocation.setText(currentUserInfo.getAddress().getCity());
        textViewEthnicity.setText(currentUserInfo.getMedicalRecord().getEthnicity());
        String age = Integer.toString(currentUserInfo.getMedicalRecord().getAge());
        textViewAge.setText(age);
        textViewUserType.setText(currentUserInfo.getUserType());
        textViewEmail.setText(currentUserInfo.getId());
        textViewNumber.setText(currentUserInfo.getPhoneNumber());
        textViewDoctor.setText(currentUserInfo.getDoctorId());
        textViewGender.setText(currentUserInfo.getMedicalRecord().getGender());

        textViewAlcohol.setText(currentUserInfo.getMedicalRecord().getFamilyMedicalHistory().getAlcoholism().toUpperCase());
        textViewBleeding.setText(currentUserInfo.getMedicalRecord().getFamilyMedicalHistory().getBleedingProblems().toUpperCase());
        textViewCancer.setText(currentUserInfo.getMedicalRecord().getFamilyMedicalHistory().getCancer().toUpperCase());
        textViewDiabetes.setText(currentUserInfo.getMedicalRecord().getFamilyMedicalHistory().getDiabetesHighBloodSugar().toUpperCase());
        textViewEpilepsy.setText(currentUserInfo.getMedicalRecord().getFamilyMedicalHistory().getEpilepsySeizures().toUpperCase());
        textViewBp.setText(currentUserInfo.getMedicalRecord().getFamilyMedicalHistory().getHighBloodPressure().toUpperCase());
        textViewHeartDisease.setText(currentUserInfo.getMedicalRecord().getFamilyMedicalHistory().getHeartDisease().toUpperCase());
        textViewMigraine.setText(currentUserInfo.getMedicalRecord().getFamilyMedicalHistory().getMigraineHeadaches().toUpperCase());

    }

    private void initializeRetrofit() {
        String BASE_URL = "https://remote-health-api.herokuapp.com";
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        service = retrofit.create(ApiService.class);
    }

    private void getUserInfoApi(String emailId) {
        ConnectivityManager connMgr = (ConnectivityManager)
                getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkInfo = connMgr.getActiveNetworkInfo();
        if (networkInfo != null && networkInfo.isConnected()) {

            Call<User> call = service.getUser(emailId);
            call.enqueue(new Callback<User>() {
                @Override
                public void onResponse(Call<User> call, Response<User> response) {
                    try {
                        setUserDetails(response.body());
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }

                @Override
                public void onFailure(Call<User> call, Throwable t) {
                    t.printStackTrace();
                    Log.d(TAG, "onFailure: Retrofit call failed: ");
                }
            });
        } else {
            Log.d(TAG, "getUserInfoApi: Failed : Network problem");
        }
    }
}
