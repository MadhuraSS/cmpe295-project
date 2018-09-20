package com.test.myapplication;

import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Bundle;

import android.support.annotation.LayoutRes;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.design.widget.Snackbar;
import android.support.design.widget.TextInputLayout;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.Toast;

import com.facebook.AccessToken;
import com.facebook.CallbackManager;
import com.facebook.FacebookCallback;
import com.facebook.FacebookException;
import com.facebook.login.LoginManager;
import com.facebook.login.LoginResult;
import com.facebook.login.widget.LoginButton;

import com.google.android.gms.auth.api.Auth;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.auth.api.signin.GoogleSignInResult;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.Scopes;
import com.google.android.gms.common.SignInButton;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.ResultCallback;
import com.google.android.gms.common.api.Scope;
import com.google.android.gms.common.api.Status;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.AuthCredential;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FacebookAuthProvider;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.auth.GoogleAuthProvider;
import com.test.myapplication.api.ApiService;
import com.test.myapplication.models.appointments.Appointment;
import com.test.myapplication.models.login.Login;
import com.test.myapplication.models.user.User;

import java.util.ArrayList;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class MainActivity extends AppCompatActivity
        implements GoogleApiClient.OnConnectionFailedListener, View.OnClickListener {

    private static final String TAG = "MainActivity";
    public static final String KEY_SHARED_PREFS_USER_GMAIL = "KEY_SHARED_PREFS_USER_GMAIL";

    private static final int FACEBOOK_SIGNOUT_REQ = 1;
    private static final int GMAIL_SIGNOUT_REQ = 2;
    private static final int SIGNOUT_REQ = 232;
    private static final int GMAIL_RC_SIGN_IN = 9001;

    private static final String EMAIL_PATTERN = "^[a-zA-Z0-9#_~!$&'()*+,;=:.\"(),:;<>@\\[\\]\\\\]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*$";

    private Button buttonLogin;

    private TextInputLayout usernameWrapper;
    private TextInputLayout passwordWrapper;

    private ProgressBar spinner;

    private Pattern pattern = Pattern.compile(EMAIL_PATTERN);
    private Matcher matcher;

    private LoginButton fbLoginButton;
    private CallbackManager mCallbackManager;

    private FirebaseAuth mAuth;
    private FirebaseAuth.AuthStateListener authStateListener;

    private GoogleApiClient mGoogleApiClient;

    private SignInButton gmailSignInButton;

    private String idTokenString = "";

    private ApiService service;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        initializeViews();

        setUpGoogleApiClient();

        initializeRetrofit();

        mAuth = FirebaseAuth.getInstance();

        mCallbackManager = CallbackManager.Factory.create();

        authStateListener = new FirebaseAuth.AuthStateListener() {
            @Override
            public void onAuthStateChanged(@NonNull FirebaseAuth firebaseAuth) {
                FirebaseUser user = FirebaseAuth.getInstance().getCurrentUser();
                if (user != null) {
                    Log.i(TAG, "onAuthStateChanged: signed_in");
                } else {
                    Log.i(TAG, "onAuthStateChanged: signed_out");
                }
            }
        };

        fbLoginButton.setReadPermissions("email", "public_profile");
        fbLoginButton.registerCallback(mCallbackManager, new FacebookCallback<LoginResult>() {
            @Override
            public void onSuccess(LoginResult loginResult) {
                handleFacebookAccessToken(loginResult.getAccessToken());

                FirebaseUser user = FirebaseAuth.getInstance().getCurrentUser();
                if (user != null) {
                    String name;
                    String email;
                    String photoUrl;
                    if (user.getDisplayName() != null) {
                        name = user.getDisplayName();
                    } else {
                        name = "Display name not available";
                    }
                    if (user.getDisplayName() != null) {
                        email = user.getEmail();
                    } else {
                        email = "Email not available";
                    }
                    if (user.getPhotoUrl() != null) {
                        photoUrl = user.getPhotoUrl().toString();
                    } else {
                        photoUrl = null;
                    }
                    boolean emailVerified = user.isEmailVerified();
                    Intent intent = new Intent(MainActivity.this, HomeActivity.class);
                    intent.putExtra("user_email", email);
                    intent.putExtra("user_name", name);
                    intent.putExtra("user_photo", photoUrl);
                    startActivityForResult(intent, FACEBOOK_SIGNOUT_REQ);

                } else {
                    Log.i(TAG, "onAuthStateChanged: logged_out");
                }
            }

            @Override
            public void onCancel() {
                Log.d(TAG, "facebook:onCancel");
            }

            @Override
            public void onError(FacebookException error) {
                Log.d(TAG, "facebook:onError", error);
            }
        });

//        buttonLogin.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//                hideKeyboard();
//
//                String username = usernameWrapper.getEditText().getText().toString();
//                String password = usernameWrapper.getEditText().getText().toString();
//
//                if (!validateEmail(username)) {
//                    usernameWrapper.setError("Not a valid email address!");
//                } else if (!validatePassword(password)) {
//                    passwordWrapper.setError("Not a valid password!");
//                } else {
//                    usernameWrapper.setErrorEnabled(false);
//                    passwordWrapper.setErrorEnabled(false);
//                    doLogin();
//                }
//            }
//        });

//        gmailSignInButton.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//                gmailSignIn();
//            }
//        });
    }

    @Override
    public void setContentView(@LayoutRes int layoutResID) {
        super.setContentView(layoutResID);

        final TextInputLayout usernameWrapper = (TextInputLayout) findViewById(R.id.usernameWrapper);
        final TextInputLayout passwordWrapper = (TextInputLayout) findViewById(R.id.passwordWrapper);

        usernameWrapper.setHint("Username");
        passwordWrapper.setHint("Password");
    }

    private void initializeViews() {
        buttonLogin = (Button) findViewById(R.id.activity_main_login_button);
        usernameWrapper = (TextInputLayout) findViewById(R.id.usernameWrapper);
        passwordWrapper = (TextInputLayout) findViewById(R.id.passwordWrapper);
        buttonLogin.setOnClickListener(this);

        usernameWrapper.getEditText().getText().clear();
        passwordWrapper.getEditText().getText().clear();

        fbLoginButton = (LoginButton) findViewById(R.id.button_facebook_login);

        gmailSignInButton = (SignInButton) findViewById(R.id.sign_in_button_gmail);
        gmailSignInButton.setOnClickListener(this);
        gmailSignInButton.setSize(SignInButton.SIZE_STANDARD);
        gmailSignInButton.setColorScheme(SignInButton.COLOR_AUTO);

        spinner = (ProgressBar) findViewById(R.id.progressBar1);


    }

    private void setUpGoogleApiClient() {

        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestScopes(new Scope(Scopes.PROFILE))
                .requestServerAuthCode(getString(R.string.default_web_client_id), false)
                .requestIdToken(getString(R.string.default_web_client_id))
                .requestProfile()
                .requestEmail()
                .build();

        // Build a GoogleApiClient with access to the Google Sign-In API and the options specified by gso.

        mGoogleApiClient = new GoogleApiClient.Builder(this)
                .enableAutoManage(this /* FragmentActivity */, this /* OnConnectionFailedListener */)
                .addApi(Auth.GOOGLE_SIGN_IN_API, gso)
                .build();
    }

    private void hideKeyboard() {
        View view = getCurrentFocus();
        if (view != null) {
            ((InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE)).
                    hideSoftInputFromWindow(view.getWindowToken(), InputMethodManager.HIDE_NOT_ALWAYS);
        }
    }

    public boolean validateEmail(String email) {
        matcher = pattern.matcher(email);
        return matcher.matches();
    }

    public boolean validatePassword(String password) {
        return password.length() > 5;
    }

    public void doLogin() {


        Intent intent = new Intent(MainActivity.this, HomeActivity.class);
        setResult(SIGNOUT_REQ);
        startActivity(intent);
    }

    @Override
    public void onStart() {
        super.onStart();
        mAuth.addAuthStateListener(authStateListener);
        // Check if user is signed in (non-null) and update UI accordingly.
        FirebaseUser currentUser = mAuth.getCurrentUser();
        updateUI(currentUser);
    }

    @Override
    public void onStop() {
        super.onStop();
        if (authStateListener != null) {
            mAuth.removeAuthStateListener(authStateListener);
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        mCallbackManager.onActivityResult(requestCode, resultCode, data);

        if (requestCode == FACEBOOK_SIGNOUT_REQ) {
            if (resultCode == RESULT_OK) {
                signOutFacebook();
            }
        }

        if (requestCode == GMAIL_SIGNOUT_REQ) {
            if (resultCode == RESULT_OK) {
                logoutGmail();
            }
        }

        if (requestCode == GMAIL_RC_SIGN_IN) {
//            GoogleSignInResult result = Auth.GoogleSignInApi.getSignInResultFromIntent(data);
//            GoogleSignInAccount account = result.getSignInAccount();
//
//            firebaseAuthWithGoogle(account);

            GoogleSignInResult result = Auth.GoogleSignInApi.getSignInResultFromIntent(data);
            handleGmailSignInResult(result);
        }
    }

    @Override
    public void onConnectionFailed(@NonNull ConnectionResult connectionResult) {
        Log.d(TAG, "onConnectionFailed: Gmail" + connectionResult);

    }

    private void handleFacebookAccessToken(AccessToken token) {
        AuthCredential credential = FacebookAuthProvider.getCredential(token.getToken());
        mAuth.signInWithCredential(credential)
                .addOnCompleteListener(this, new OnCompleteListener<AuthResult>() {
                    @Override
                    public void onComplete(@NonNull Task<AuthResult> task) {
                        if (task.isSuccessful()) {
                            // Sign in success, update UI with the signed-in user's information
                            FirebaseUser user = mAuth.getCurrentUser();
                            updateUI(user);
                        } else {
                            // If sign in fails, display a message to the user.
                            Log.w(TAG, "signInWithCredential:failure", task.getException());
                            Toast.makeText(MainActivity.this, "Authentication failed.",
                                    Toast.LENGTH_SHORT).show();
                            updateUI(null);
                        }
                    }
                });
    }

    private void updateUI(FirebaseUser user) {
        if (user != null) {
            findViewById(R.id.button_facebook_login).setVisibility(View.GONE);
        } else {
            findViewById(R.id.button_facebook_login).setVisibility(View.VISIBLE);
        }
    }

    public void signOutFacebook() {
        mAuth.signOut();
        LoginManager.getInstance().logOut();
    }

    private void gmailSignIn() {
        Intent signInIntent = Auth.GoogleSignInApi.getSignInIntent(mGoogleApiClient);
        startActivityForResult(signInIntent, GMAIL_RC_SIGN_IN);
    }

    private void firebaseAuthWithGoogle(GoogleSignInAccount acct) {
        Log.d(TAG, "Google User Id :" + acct.getId());

        // --------------------------------- //
        // BELOW LINE GIVES YOU JSON WEB TOKEN, (USED TO GET ACCESS TOKEN) :
        Log.d(TAG, "Google JWT : " + acct.getIdToken());


        // --------------------------------- //

        // Save this JWT in global String :
        idTokenString = acct.getIdToken();

        AuthCredential credential = GoogleAuthProvider.getCredential(acct.getIdToken(), null);
        mAuth.signInWithCredential(credential)
                .addOnCompleteListener(this, new OnCompleteListener<AuthResult>() {
                    @Override
                    public void onComplete(@NonNull Task<AuthResult> task) {
                        Log.d(TAG, "signInWithCredential:onComplete:" + task.isSuccessful());

                        if (task.isSuccessful()) {
                            // --------------------------------- //
                            // BELOW LINE GIVES YOU FIREBASE TOKEN ID :
                            Log.d(TAG, "Firebase User Access Token : " + task.getResult().getUser().getToken(true));
                            // --------------------------------- //
                        }
                        // If sign in fails, display a message to the user. If sign in succeeds
                        // the auth state listener will be notified and logic to handle the
                        // signed in user can be handled in the listener.
                        else {
                            Log.w(TAG, "Authentication failed: ", task.getException());
                            Toast.makeText(MainActivity.this, "Authentication failed.",
                                    Toast.LENGTH_SHORT).show();
                        }
                    }
                });
    }


    private void handleGmailSignInResult(GoogleSignInResult result) {
        if (result.isSuccess()) {
            GoogleSignInAccount acct = result.getSignInAccount();
            if (acct != null) {
//                Log.d(TAG, "handleGmailSignInResult: Google User Id: " + acct.getId());
//                Log.d(TAG, "handleGmailSignInResult: ********************************");
//                Log.d(TAG, "handleGmailSignInResult: Server auth code = " + acct.getServerAuthCode());
//                Log.d(TAG, "handleGmailSignInResult: Google Id token =  " + acct.getIdToken());
//                Log.d(TAG, "handleGmailSignInResult: Photo Url = " + acct.getPhotoUrl());
//                // Save this JWT in global String
                idTokenString = acct.getIdToken();
                String name;
                String email;
                String photoUrl;

                if (acct.getDisplayName() != null) {
                    name = acct.getDisplayName();
                } else {
                    name = "Display Name not available";
                }
                if (acct.getDisplayName() != null) {
                    email = acct.getEmail();
                } else {
                    email = "Email not available";
                }
                if (acct.getPhotoUrl() != null) {
                    photoUrl = acct.getPhotoUrl().toString();
                } else {
                    photoUrl = null;
                }

                Toast.makeText(MainActivity.this, "Logged in via Gmail as: " + acct.getEmail(), Toast.LENGTH_SHORT).show();

//                SharedPreferences.Editor editor = getSharedPreferences(
//                        KEY_SHARED_PREFS_USER_GMAIL,
//                        MODE_PRIVATE).edit();
//                editor.putString(getString(R.string.shared_pref_gmail), email);
//                editor.apply();

                checkIfUserExists(email, photoUrl, name);


//                Intent intent = new Intent(MainActivity.this, HomeActivity.class);
//                intent.putExtra("user_email_gmail", email);
//                intent.putExtra("user_name_gmail", name);
//                intent.putExtra("user_photo_gmail", photoUrl);
//                startActivityForResult(intent, GMAIL_SIGNOUT_REQ);
            }
            updateUIGmail(true);
        } else {
            updateUIGmail(false);
            Log.i(TAG, "handleGoogleSignInResult: gmail login failed !");
        }
    }

    private void initializeRetrofit() {
        String BASE_URL = "https://remote-health-api.herokuapp.com";
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        service = retrofit.create(ApiService.class);
    }

    private void checkIfUserExists(final String email, final String photoUrl, final String name) {
        Log.d(TAG, "checkIfUserExists: ");

        Toast.makeText(MainActivity.this, "Checking if user is valid", Toast.LENGTH_SHORT).show();

        ConnectivityManager connMgr = (ConnectivityManager)
                getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkInfo = connMgr.getActiveNetworkInfo();
        if (networkInfo != null && networkInfo.isConnected()) {

            Call<User> call = service.getUser(email);

            Log.d(TAG, "checkIfUserExists: user url = " + call.request().url());

            call.enqueue(new Callback<User>() {
                @Override
                public void onResponse(Call<User> call, Response<User> response) {
                    try {
                        if (response != null) {
                            if (response.message().equals("User not found")) {
                                spinner.setVisibility(View.INVISIBLE);
                                Log.d(TAG, "onResponse: user not found");

                                Toast.makeText(MainActivity.this, "User not found", Toast.LENGTH_SHORT).show();


                                //todo alert box for asking the user to register!

                                showAlertDialog("USER AUTHENTICATION FAILED !", "Please register using our web application", "OK", "");


                            } else {
                                //todo user found
                                if (response.body() == null) {

                                    showAlertDialog("LOGIN FAILED !", "Please verify email and password", "OK", "");
                                    spinner.setVisibility(View.INVISIBLE);

                                    Log.d(TAG, "onResponse: response.body() = null");

                                    Toast.makeText(MainActivity.this, "response.body() = null", Toast.LENGTH_SHORT).show();

                                } else {
                                    //todo response.body() not null
                                    if (response.body().getId().equals(email)) {
                                        //todo email matches

                                        spinner.setVisibility(View.INVISIBLE);
                                        Log.d(TAG, "onResponse: User found and email verified");

                                        Toast.makeText(MainActivity.this, "User verified!", Toast.LENGTH_SHORT).show();

                                        SharedPreferences.Editor editor = getSharedPreferences(
                                                KEY_SHARED_PREFS_USER_GMAIL,
                                                MODE_PRIVATE).edit();
                                        editor.putString(getString(R.string.shared_pref_gmail), response.body().getId());
                                        editor.putString(getString(R.string.shared_pref_gmail_photo), photoUrl);
                                        editor.putString(getString(R.string.shared_pref_gmail_name), response.body().getName().getFirstName() + " " + response.body().getName().getLastName());
                                        editor.putString(getString(R.string.shared_pref_gmail_name_first), response.body().getName().getFirstName());
                                        editor.putString(getString(R.string.shared_pref_gmail_name_last), response.body().getName().getLastName());
                                        editor.apply();

                                        Log.d(TAG, "onResponse: starting homeActivity");

                                        Intent intent = new Intent(MainActivity.this, HomeActivity.class);
                                        intent.putExtra("user_email_gmail", response.body().getId());
                                        intent.putExtra("user_name_gmail", response.body().getName().getFirstName() + " " + response.body().getName().getLastName());
                                        intent.putExtra("user_photo_gmail", photoUrl);

                                        spinner.setVisibility(View.GONE);

                                        startActivityForResult(intent, GMAIL_SIGNOUT_REQ);

                                    } else {
                                        spinner.setVisibility(View.INVISIBLE);
                                        showAlertDialog("LOGIN FAILED !", "Error in verifying username and password. Please try again", "OK", "");
                                        //todo email does not match. Verification failed! ask user to create an account! alert box
                                        Log.d(TAG, "onResponse: email does not match. Verification failed");
                                        Toast.makeText(MainActivity.this, "Error in verifying!", Toast.LENGTH_SHORT).show();
                                    }
                                }
                            }

                        } else {
                            spinner.setVisibility(View.INVISIBLE);
                            Toast.makeText(MainActivity.this, "response = null", Toast.LENGTH_SHORT).show();
                            Log.d(TAG, "onResponse: response = null");
                        }

//                        if (!Objects.equals(response.message(), "User not found")) {
//                            Log.d(TAG, "onResponse: User found");
//                            if (Objects.equals(response.body().getId(), email)) {
//                                Log.d(TAG, "onResponse: User found and email verified");
//
//                                Toast.makeText(MainActivity.this, "User verified!", Toast.LENGTH_SHORT).show();
//
//                                SharedPreferences.Editor editor = getSharedPreferences(
//                                        KEY_SHARED_PREFS_USER_GMAIL,
//                                        MODE_PRIVATE).edit();
//                                editor.putString(getString(R.string.shared_pref_gmail), response.body().getId());
//                                editor.putString(getString(R.string.shared_pref_gmail_photo), photoUrl);
//                                editor.putString(getString(R.string.shared_pref_gmail_name), response.body().getName().getFirstName() + " " + response.body().getName().getLastName());
//                                editor.putString(getString(R.string.shared_pref_gmail_name_first), response.body().getName().getFirstName());
//                                editor.putString(getString(R.string.shared_pref_gmail_name_last), response.body().getName().getLastName());
//                                editor.apply();
//
//                                Log.d(TAG, "onResponse: starting homeActivity");
//
//                                Intent intent = new Intent(MainActivity.this, HomeActivity.class);
//                                intent.putExtra("user_email_gmail", response.body().getId());
//                                intent.putExtra("user_name_gmail", response.body().getName().getFirstName() + " " + response.body().getName().getLastName());
//                                intent.putExtra("user_photo_gmail", photoUrl);
//
//                                spinner.setVisibility(View.GONE);
//
//                                startActivityForResult(intent, GMAIL_SIGNOUT_REQ);
//
//                            } else {
//                                Toast.makeText(MainActivity.this, "Error in verifying!", Toast.LENGTH_SHORT).show();
//                            }
//
//                        } else if (Objects.equals(response.message(), "User not found")) {
//                            Toast.makeText(MainActivity.this, "User not found. Please register!", Toast.LENGTH_LONG).show();
//                        }

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

    private void updateUIGmail(boolean signedIn) {
        if (signedIn) {
//            findViewById(R.id.sign_in_button).setVisibility(View.GONE);
//            findViewById(R.id.sign_out_and_disconnect).setVisibility(View.VISIBLE);
        } else {
//            mStatusTextView.setText(R.string.signed_out);
//
//            findViewById(R.id.sign_in_button).setVisibility(View.VISIBLE);
//            findViewById(R.id.sign_out_and_disconnect).setVisibility(View.GONE);
        }
    }

    private void signOutGmail() {

        Auth.GoogleSignInApi.signOut(mGoogleApiClient).setResultCallback(
                new ResultCallback<Status>() {
                    @Override
                    public void onResult(Status status) {

                        Log.d(TAG, "onResult: Gmail Signout Successful ");
                        Toast.makeText(MainActivity.this, "Gmail Signout", Toast.LENGTH_SHORT).show();
//                        updateUIGmail(false);
                    }
                });
    }

    public void logoutGmail() {
        mGoogleApiClient.connect();
        mGoogleApiClient.registerConnectionCallbacks(new GoogleApiClient.ConnectionCallbacks() {
            @Override
            public void onConnected(@Nullable Bundle bundle) {

                FirebaseAuth.getInstance().signOut();
                if (mGoogleApiClient.isConnected()) {
                    Auth.GoogleSignInApi.signOut(mGoogleApiClient).setResultCallback(new ResultCallback<Status>() {
                        @Override
                        public void onResult(@NonNull Status status) {
                            if (status.isSuccess()) {
                                Log.d(TAG, "User Gmail Logged out");
                                Toast.makeText(MainActivity.this, "Gmail Signout", Toast.LENGTH_SHORT).show();
                            }
                        }
                    });
                }
            }

            @Override
            public void onConnectionSuspended(int i) {
                Log.d(TAG, "Google API Client Connection Suspended");
            }
        });
    }

    @Override
    public void onClick(View view) {
        switch (view.getId()) {
            case R.id.activity_main_login_button: {

                Log.d(TAG, "onClick: button login");

                hideKeyboard();


                String email = usernameWrapper.getEditText().getText().toString().trim();

                String password = passwordWrapper.getEditText().getText().toString().trim();


                if (!Objects.equals(email, "") && !Objects.equals(password, "")) {
                    spinner.setVisibility(View.VISIBLE);


                    checkEmailPassword(email, password, view);
                } else {
                    if (email.equals("")) {
                        usernameWrapper.getEditText().setError("Please provide an email");
                    }
                    if (password.equals("")) {
                        passwordWrapper.getEditText().setError("Please provide a password");
                    }
                }


//                if (!validateEmail(username)) {
//                    usernameWrapper.setError("Not a valid email address!");
//                } else if (!validatePassword(password)) {
//                    passwordWrapper.setError("Not a valid password!");
//                } else {
//                    usernameWrapper.setErrorEnabled(false);
//                    passwordWrapper.setErrorEnabled(false);
//                    doLogin();
//                }

                break;

            }

            case R.id.sign_in_button_gmail: {

                spinner.setVisibility(View.VISIBLE);

                gmailSignIn();

                break;
            }

        }

//        buttonLogin.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//                hideKeyboard();
//
//                String username = usernameWrapper.getEditText().getText().toString();
//                String password = usernameWrapper.getEditText().getText().toString();
//
//                if (!validateEmail(username)) {
//                    usernameWrapper.setError("Not a valid email address!");
//                } else if (!validatePassword(password)) {
//                    passwordWrapper.setError("Not a valid password!");
//                } else {
//                    usernameWrapper.setErrorEnabled(false);
//                    passwordWrapper.setErrorEnabled(false);
//                    doLogin();
//                }
//            }
//        });
    }

    private void checkEmailPassword(final String email, String password, final View view) {
        Call<Login> call = service.checkLoginCredentials(email, password);
        Log.d(TAG, "checkEmailPassword: email = " + email);
        Log.d(TAG, "checkEmailPassword: password = " + password);

        Log.d(TAG, "checkEmailPassword: req url = " + call.request().url());
        call.enqueue(new Callback<Login>() {
            @Override
            public void onResponse(Call<Login> call, Response<Login> response) {
                try {
                    if (response != null) {
                        Log.d(TAG, "onResponse: not null = " + response.message());

                        if (response.message().equals("OK")) {

                            if (response.body().getMessage().equals("Login Successful!")) {
                                Log.d(TAG, "onResponse: User email and password valid");

                                usernameWrapper.getEditText().getText().clear();
                                passwordWrapper.getEditText().getText().clear();

                                checkIfUserExists(email, null, "");

//                                getUserInfo(email);
                            }


                        } else /*if (response.message().equals("Unauthorized") || response.message().equals("Service Unavailable") )*/ {
                            spinner.setVisibility(View.INVISIBLE);
                            Log.d(TAG, "onResponse: user email and password login failed");

                            showAlertDialog("Login Failed!", "Please verify your email and password", "OK", "");
//                            AlertDialog.Builder builder1 = new AlertDialog.Builder(MainActivity.this);
//                            builder1.setMessage("Please verify your email and password");
//                            builder1.setTitle("Login failed !");
//                            builder1.setCancelable(true);
//
//                            builder1.setPositiveButton(
//                                    "OK",
//                                    new DialogInterface.OnClickListener() {
//                                        public void onClick(DialogInterface dialog, int id) {
//                                            dialog.cancel();
//                                        }
//                                    });
//
//                            AlertDialog alert11 = builder1.create();
//                            alert11.show();
                        }
                    } else {
                        Log.d(TAG, "onResponse: null ");
                    }

                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            @Override
            public void onFailure(Call<Login> call, Throwable t) {
                t.printStackTrace();
                Log.d(TAG, "onFailure: Retrofit call failed: ");
            }
        });
    }

    private void showAlertDialog(String tile, String message, String positiveButtonText, String negativeButtonText) {
        AlertDialog.Builder builder1 = new AlertDialog.Builder(MainActivity.this);
        builder1.setTitle(tile);
        builder1.setMessage(message);
        builder1.setCancelable(true);

        builder1.setPositiveButton(
                positiveButtonText,
                new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        dialog.cancel();
                    }
                });

        AlertDialog alert11 = builder1.create();
        alert11.show();
    }

    private void getUserInfo(String email) {
        Log.d(TAG, "getUserInfo: ");
        Call<User> call = service.getUser(email);
        call.enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                try {
                    if (response != null) {
                        String name = response.body().getName().getFirstName() + response.body().getName().getLastName();
                        String email = response.body().getId();
                        String stamp = "login_button";

                        Log.d(TAG, "onResponse: name = " + name);
                        Log.d(TAG, "onResponse: email = " + email);

                        Intent intent = new Intent(MainActivity.this, HomeActivity.class);
                        intent.putExtra("login_button_name", name);
                        intent.putExtra("login_button_email", email);
                        intent.putExtra("login_button_stamp", stamp);

                        spinner.setVisibility(View.INVISIBLE);

                        startActivity(intent);


                    }

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
    }
}
