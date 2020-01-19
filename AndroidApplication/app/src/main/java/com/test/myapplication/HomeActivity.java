package com.test.myapplication;

import android.Manifest;
import android.annotation.TargetApi;
import android.app.Dialog;
import android.content.ContentUris;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.CalendarContract;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.TabLayout;
import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;
import android.support.v4.view.ViewPager;
import android.util.Log;
import android.view.View;
import android.support.design.widget.NavigationView;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.RequestOptions;
import com.test.myapplication.fragments.AppointmentsFragment;
import com.test.myapplication.models.appointments.Appointment;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

public class HomeActivity extends AppCompatActivity
        implements NavigationView.OnNavigationItemSelectedListener,
        View.OnClickListener,
        CustomRvAdapter.OnRecyclerViewItemClickListener {

    private static final String TAG = "HomeActivity";
    private ArrayList<Appointment> dataListAppointment = new ArrayList<>();

    private String currentUserSharedPrefsEmail;
    private String currentUserSharedPrefsPhoto;
    private String currentUserSharedPrefsName;
    private String currentUserSharedPrefsNameFirst;
    private String currentUserSharedPrefsNameLast;

    private TextView textViewNavHeaderName;
    private TextView textViewNavHeaderEmail;
    private ImageView imageViewPhoto;
    private FloatingActionButton fab;

    private static final int PERMISSION_REQUEST_CODE_CALENDAR = 111;
    private static final int PERMISSION_REQUEST_CODE_LOCATION = 112;

    private static final String CALENDAR_PERMISSION = Manifest.permission.WRITE_CALENDAR;

    private FragmentPagerAdapter adapterViewPager;
    private TabLayout tabLayout;
    private ViewPager viewPager;

    String name;
    String email;
    String photoUrl;

    Intent intent;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        Log.d(TAG, "onCreate: HomeActivity created!");

        if (getIntent().hasExtra("user_email_gmail")) {
            currentUserSharedPrefsEmail = getIntent().getStringExtra("user_email_gmail");
        }

        SharedPreferences prefs = getSharedPreferences(
                MainActivity.KEY_SHARED_PREFS_USER_GMAIL,
                MODE_PRIVATE);
        currentUserSharedPrefsEmail = prefs.getString(getString(R.string.shared_pref_gmail), null);
        currentUserSharedPrefsPhoto = prefs.getString(getString(R.string.shared_pref_gmail_photo), null);
        currentUserSharedPrefsName = prefs.getString(getString(R.string.shared_pref_gmail_name), null);

        if (currentUserSharedPrefsEmail != null) {
            Log.d(TAG, "onCreate: shared prefs = null");
//            String name = prefs.getString(getString(R.string.shared_pref_gmail), "No email available");
        }

        setUpToolbarAndNavigationDrawer();

        setupViewPagerAndTabs();

        initializeViews();

        setIntent();

    }

    @Override
    protected void onResume() {
        super.onResume();
    }

    @Override
    public void onBackPressed() {
        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        if (drawer.isDrawerOpen(GravityCompat.START)) {
            drawer.closeDrawer(GravityCompat.START);
        } else {
            super.onBackPressed();
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.home, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();
        if (id == R.id.action_settings) {
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    @SuppressWarnings("StatementWithEmptyBody")
    @Override
    public boolean onNavigationItemSelected(MenuItem item) {
        int id = item.getItemId();

        if (id == R.id.nav_user_profile) {
            Intent intent = new Intent(this, UserProfileActivity.class);
            if (photoUrl != null) {
                intent.putExtra("user_photo", photoUrl);
            }
            if (currentUserSharedPrefsEmail != null) {
                intent.putExtra("user_profile_email", currentUserSharedPrefsEmail);
            }

            startActivity(intent);

        } else if (id == R.id.nav_book_appointment) {

            Intent intent = new Intent(this, BookAppointmentActivity.class);
            intent.putExtra("book_app_email_id", currentUserSharedPrefsEmail);
            startActivity(intent);

        } else if (id == R.id.nav_manage) {

        } else if (id == R.id.nav_uber) {

            if (checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                if (shouldShowRequestPermissionRationale(Manifest.permission.ACCESS_FINE_LOCATION)) {

                } else {
                    String[] permissions = new String[]{Manifest.permission.ACCESS_FINE_LOCATION};
                    requestPermissions(permissions, PERMISSION_REQUEST_CODE_LOCATION);
                }

            } else if (checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {

                Intent intent = new Intent(HomeActivity.this, UberActivity.class);
                startActivity(intent);


            }


        } else if (id == R.id.nav_calendar) {
            if (checkSelfPermission(
                    Manifest.permission.WRITE_CALENDAR) != PackageManager.PERMISSION_GRANTED) {
                if (shouldShowRequestPermissionRationale(Manifest.permission.WRITE_CALENDAR)) {
                    // Show an expanation to the user *asynchronously* -- don't block
                    // this thread waiting for the user's response! After the user
                    // sees the explanation, try again to request the permission.
                } else {
                    // No explanation needed, we can request the permission.
                    String[] permissions = new String[]{Manifest.permission.WRITE_CALENDAR};
                    requestPermissions(permissions, PERMISSION_REQUEST_CODE_CALENDAR);

                    // PERMISSION_REQUEST_CODE is an
                    // app-defined int constant. The callback method gets the
                    // result of the request.
                }
            } else if (checkSelfPermission(
                    Manifest.permission.WRITE_CALENDAR) == PackageManager.PERMISSION_GRANTED) {
                // Permission is granted
                Uri.Builder builder = CalendarContract.CONTENT_URI.buildUpon();
                builder.appendPath("time");
                ContentUris.appendId(builder, Calendar.getInstance().getTimeInMillis());
                Intent intent = new Intent(Intent.ACTION_VIEW)
                        .setData(builder.build());
                startActivity(intent);
            }

        } else if (id == R.id.logout_drawer) {

            Intent i = new Intent();
            setResult(RESULT_OK, i);
            finish();

        }

        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        drawer.closeDrawer(GravityCompat.START);
        return true;
    }


    private void setUpToolbarAndNavigationDrawer() {

        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
                this, drawer, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawer.setDrawerListener(toggle);
        toggle.syncState();

    }

    private void setupViewPagerAndTabs() {

        viewPager = (ViewPager) findViewById(R.id.viewpager);
        adapterViewPager = new MyPagerAdapter(getSupportFragmentManager(), this);
        viewPager.setAdapter(adapterViewPager);

        tabLayout = (TabLayout) findViewById(R.id.tabs);
        tabLayout.setupWithViewPager(viewPager);

    }

    private void initializeViews() {

        NavigationView navigationView = (NavigationView) findViewById(R.id.nav_view);
        navigationView.setNavigationItemSelectedListener(this);

        View header = navigationView.getHeaderView(0);

        textViewNavHeaderEmail = (TextView) header.findViewById(R.id.nav_header_email);
        textViewNavHeaderName = (TextView) header.findViewById(R.id.nav_header_name);
        imageViewPhoto = (ImageView) header.findViewById(R.id.nav_header_photo);
        fab = (FloatingActionButton) findViewById(R.id.fab);
        fab.setOnClickListener(this);

    }

    private void setIntent() {

        intent = getIntent();

        if (intent.hasExtra("user_name")) {
            name = intent.getStringExtra("user_name");
            textViewNavHeaderName.setText(name);
        }

        if (intent.hasExtra("user_email")) {
            email = intent.getStringExtra("user_email");
            textViewNavHeaderEmail.setText(email);
        }

        if (intent.hasExtra("user_email_gmail")) {
            email = intent.getStringExtra("user_email_gmail");
            currentUserSharedPrefsEmail = intent.getStringExtra("user_email_gmail");
            textViewNavHeaderEmail.setText(email);
        }

        if (intent.hasExtra("user_name_gmail")) {
            name = intent.getStringExtra("user_name_gmail");
            textViewNavHeaderName.setText(name);
        }

        if (intent.hasExtra("user_photo_gmail")) {
            photoUrl = intent.getStringExtra("user_photo_gmail");

            if (photoUrl != null) {

                Glide.with(HomeActivity.this)
                        .load(photoUrl)
                        .apply(RequestOptions.circleCropTransform())
                        .into(imageViewPhoto);

            }
        }

        Glide.with(HomeActivity.this)
                .load(currentUserSharedPrefsPhoto)
                .apply(RequestOptions.circleCropTransform())
                .into(imageViewPhoto);

        textViewNavHeaderName.setText(currentUserSharedPrefsName);
        textViewNavHeaderEmail.setText(currentUserSharedPrefsEmail);


    }

    @Override
    public void onClick(View view) {

        switch (view.getId()) {
            case R.id.fab:
                Log.d(TAG, "onClick: fab");
                Intent intent = new Intent(this, PredictionsActivity.class);
                startActivity(intent);

//                Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
//                        .setAction("Action", null).show();
                break;

        }

    }

    @TargetApi(23)
    private boolean permissionExists() {
        int currentApiVersion = android.os.Build.VERSION.SDK_INT;
        if (currentApiVersion < Build.VERSION_CODES.M) {

            // Permissions are already granted during INSTALL TIME for older OS version
            return true;
        }

        int granted = checkSelfPermission(CALENDAR_PERMISSION);
        if (granted == PackageManager.PERMISSION_GRANTED) {
            return true;
        }
        return false;
    }

    @TargetApi(23)
    private void requestUserForPermission() {
        int currentApiVersion = android.os.Build.VERSION.SDK_INT;
        if (currentApiVersion < Build.VERSION_CODES.M) {
            // This OS version is lower then Android M, therefore we have old permission model and should not ask for permission
            return;
        }
        String[] permissions = new String[]{CALENDAR_PERMISSION};
        requestPermissions(permissions, PERMISSION_REQUEST_CODE_CALENDAR);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        switch (requestCode) {
            case PERMISSION_REQUEST_CODE_CALENDAR:
                if (permissions.length < 0) {
                    return;
                }
                if (grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    // contacts permission was granted! Let's populate the listview.
                    showCalendar();
                } else {
                    // contactss permission was denied, lets warn the user that we need this permission!
                    Toast.makeText(getApplicationContext(), "You need to grant calendar permission", Toast.LENGTH_SHORT).show();
                }
                break;
        }
    }

    private void checkPermissions(String permissionString) {

//        if (checkSelfPermission(permissionString) != PackageManager.PERMISSION_GRANTED) {
//
//            // Should we show an explanation?
//            if (shouldShowRequestPermissionRationale(permissionString)) {
//
//                // Show an expanation to the user *asynchronously* -- don't block
//                // this thread waiting for the user's response! After the user
//                // sees the explanation, try again to request the permission.
//
//            } else {
//                // No explanation needed, we can request the permission.
//                String[] permissions = new String[]{permissionString};
//                requestPermissions(permissions, PERMISSION_REQUEST_CODE);
//
//
//                // PERMISSION_REQUEST_CODE is an
//                // app-defined int constant. The callback method gets the
//                // result of the request.
//            }
//
//        } else if (checkSelfPermission(permissionString) == PackageManager.PERMISSION_GRANTED) {
//
//            // Permission is granted, execute code normally since you have the permission.
//            // For example, here we are granted the contacts permission so now we can actually access the contacts here.
//
//            Uri.Builder builder = CalendarContract.CONTENT_URI.buildUpon();
//            builder.appendPath("time");
//            ContentUris.appendId(builder, Calendar.getInstance().getTimeInMillis());
//            Intent intent = new Intent(Intent.ACTION_VIEW)
//                    .setData(builder.build());
//            startActivity(intent);
//
//        }

    }

    private void showCalendar() {
        Uri.Builder builder = CalendarContract.CONTENT_URI.buildUpon();
        builder.appendPath("time");
        ContentUris.appendId(builder, Calendar.getInstance().getTimeInMillis());
        Intent intent = new Intent(Intent.ACTION_VIEW)
                .setData(builder.build());
        startActivity(intent);
    }

    @Override
    public void onItemClick(int position) {
//        Toast.makeText(HomeActivity.this, "Clicked on " +
//                dataListAppointment.get(position) + " at position " + position, Toast.LENGTH_SHORT).show();

        Appointment appointment = dataListAppointment.get(position);

        Log.d(TAG, "onItemClick: app details = "+appointment.toString());
//
//        if (!appointment.getStatus().equals("approved")) {
//            showAppointmentDetailsDialog(
//                    appointment.getPurpose(),
//                    appointment.getDoctorName(),
//                    appointment.getDoctorId(),
//                    appointment.getDate(),
//                    appointment.getStartTime(),
//                    appointment.getLocation()
//            );
//        }



//        final Dialog dialog = new Dialog(this);
//        dialog.setContentView(R.layout.custom_dialog_list_view);
//        dialog.setTitle("Title...");
//
//        // set the custom dialog components - text, image and button
//        TextView text = (TextView) dialog.findViewById(R.id.text);
//        text.setText("Android custom dialog example!");
//        ImageView image = (ImageView) dialog.findViewById(R.id.image);
//        image.setImageResource(R.drawable.ic_launcher);
//
//        Button dialogButton = (Button) dialog.findViewById(R.id.dialogButtonOK);
//        // if button is clicked, close the custom dialog
//        dialogButton.setOnClickListener(new OnClickListener() {
//            @Override
//            public void onClick(View v) {
//                dialog.dismiss();
//            }
//        });

//        dialog.show();


    }

    private void showAppointmentDetailsDialog(String title, String name, String email, String date, String time, String location) {
        final Dialog dialog = new Dialog(this);
        dialog.setContentView(R.layout.custom_dialog_list_view);

        dialog.setTitle(title);

        TextView textViewDoctorName = (TextView) dialog.findViewById(R.id.dialog_doctor_name);
        TextView textViewDoctorEmail = (TextView) dialog.findViewById(R.id.dialog_doctor_email);
        TextView textViewDate = (TextView) dialog.findViewById(R.id.dialog_appointment_date);
        TextView textViewTime = (TextView) dialog.findViewById(R.id.dialog_app_time);
        TextView textViewLocation = (TextView) dialog.findViewById(R.id.dialog_app_location);

        textViewDoctorName.setText(name);
        textViewDoctorEmail.setText(email);
        textViewDate.setText(date);
        textViewTime.setText(time);
        textViewLocation.setText(location);

//        Button ok = (Button) dialog.findViewById(R.id.dialog_app_ok);
//
//        ok.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//                dialog.dismiss();
//            }
//        });

        dialog.show();
    }

    class ViewPagerAdapter extends FragmentPagerAdapter {
        private final List<Fragment> mFragmentList = new ArrayList<>();
        private final List<String> mFragmentTitleList = new ArrayList<>();

        private Context context;


        public ViewPagerAdapter(FragmentManager manager, Context context) {
            super(manager);
            this.context = context;

        }

        public ViewPagerAdapter(FragmentManager manager) {
            super(manager);

        }

        @Override
        public Fragment getItem(int position) {
            return mFragmentList.get(position);
        }

        @Override
        public int getCount() {
            return mFragmentList.size();
        }

        public void addFragment(Fragment fragment, String title) {
            mFragmentList.add(fragment);
            mFragmentTitleList.add(title);
        }

        @Override
        public CharSequence getPageTitle(int position) {
            return mFragmentTitleList.get(position);
        }
    }

    private class MyPagerAdapter extends FragmentPagerAdapter {
        private int TAB_COUNT = 3;
        private Context context;
        private String tabTitles[] = new String[]{
                getString(R.string.appointment_type_approved),
                getString(R.string.appointment_type_pending),
                getString(R.string.appointment_type_past)
        };

        public MyPagerAdapter(FragmentManager fm, Context context) {
            super(fm);
            this.context = context;
        }

        @Override
        public int getCount() {
            return TAB_COUNT;
        }

        @Override
        public Fragment getItem(int position) {
            switch (position) {
                case 0:
                    return AppointmentsFragment.newInstance(position,
                            getString(R.string.appointment_type_approved),
                            currentUserSharedPrefsEmail);

                case 1:
                    return AppointmentsFragment.newInstance(position + 1,
                            getString(R.string.appointment_type_pending),
                            currentUserSharedPrefsEmail);

                case 2:
                    return AppointmentsFragment.newInstance(position + 1,
                            getString(R.string.appointment_type_past),
                            currentUserSharedPrefsEmail);
            }
            return null;
        }

        @Override
        public CharSequence getPageTitle(int position) {
            return tabTitles[position];
        }
    }
}
