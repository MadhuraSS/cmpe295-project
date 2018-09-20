package com.test.myapplication.fragments;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.Fragment;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.Toast;

import com.test.myapplication.CustomRvAdapter;
import com.test.myapplication.MainActivity;
import com.test.myapplication.R;
import com.test.myapplication.api.ApiService;
import com.test.myapplication.models.appointments.Appointment;

import java.util.ArrayList;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

/**
 * Created by NehaRege on 10/26/17.
 */
public class AppointmentsFragment extends Fragment
        implements CustomRvAdapter.OnRecyclerViewItemClickListener {

    public static final String KEY_ARG_PAGE = "KEY_ARG_PAGE";
    public static final String KEY_APP_TYPE = "KEY_APP_TYPE";
    public static final String KEY_EMAIL = "KEY_EMAIL";
    private static final String TAG = "AppointmentsFragment";

    private ArrayList<Appointment> dataListAppointment;

    private String currentUserEmail;

    private RecyclerView recyclerView;
    private RecyclerView.Adapter rvAdapter;
    private RecyclerView.LayoutManager rvLayoutManager;

    private ProgressBar spinner;

    private int page;
    private String appType;

    private ApiService service;

    public static AppointmentsFragment newInstance(int page, String eventType, String email) {

        AppointmentsFragment appointmentsFragment = new AppointmentsFragment();

        Bundle bundle = new Bundle();
        bundle.putInt(KEY_ARG_PAGE, page);
        bundle.putString(KEY_APP_TYPE, eventType);
        bundle.putString(KEY_EMAIL, email);

        appointmentsFragment.setArguments(bundle);

        return appointmentsFragment;

    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        initializeRetrofit();

        getSharedPrefs();


        page = getArguments().getInt(KEY_ARG_PAGE);
        appType = getArguments().getString(KEY_APP_TYPE);
//        currentUserEmail = getArguments().getString(KEY_EMAIL);

        dataListAppointment = new ArrayList<>();
    }

    @Override
    public void onResume() {
        super.onResume();
    }

    @Override
    public void onStart() {
        super.onStart();
    }

    @Override
    public void onStop() {
        super.onStop();
    }

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.fragment_approved_appointments, container, false);

        recyclerView = (RecyclerView) rootView.findViewById(R.id.recycler_view);

        spinner = (ProgressBar) rootView.findViewById(R.id.progressBar2);
        spinner.setVisibility(View.VISIBLE);

        rvLayoutManager = new LinearLayoutManager(getActivity());
        recyclerView.setLayoutManager(rvLayoutManager);

        if (appType.equals(getString(R.string.appointment_type_approved))) {

            loadAppointments(currentUserEmail, getString(R.string.appointment_type_approved));

        } else if (appType.equals(getString(R.string.appointment_type_pending))) {
            loadAppointments(currentUserEmail, getString(R.string.appointment_type_pending));

        } else if (appType.equals(getString(R.string.appointment_type_past))) {

            loadAppointments(currentUserEmail, getString(R.string.appointment_type_past));

        }

        rvAdapter = new CustomRvAdapter(dataListAppointment, this);
        recyclerView.setAdapter(rvAdapter);

        return rootView;
    }

    @Override
    public void onItemClick(int position) {
//        Toast.makeText(this.getActivity(), "Clicked on " + dataListAppointment.get(position) + " at position " + position, Toast.LENGTH_SHORT).show();
    }

    private void initializeRetrofit() {
        String BASE_URL_APPOINTMENT = "https://remote-health-api.herokuapp.com";
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(BASE_URL_APPOINTMENT)
                .addConverterFactory(GsonConverterFactory.create())
                .build();
        service = retrofit.create(ApiService.class);
    }

    private void getSharedPrefs() {
        SharedPreferences prefs = this.getActivity().getSharedPreferences(MainActivity.KEY_SHARED_PREFS_USER_GMAIL, Context.MODE_PRIVATE);
        currentUserEmail = prefs.getString(getString(R.string.shared_pref_gmail), null);
    }

    private void loadAppointments(String emailId, final String type) {
        Call<ArrayList<Appointment>> call = service.getAppointments(emailId);
        call.enqueue(new Callback<ArrayList<Appointment>>() {
            @Override
            public void onResponse(Call<ArrayList<Appointment>> call,
                                   Response<ArrayList<Appointment>> response) {
                try {
                    dataListAppointment.clear();

                    if (type.equals(getString(R.string.appointment_type_approved))) {
                        spinner.setVisibility(View.GONE);

                        for (int i = 0; i < response.body().size(); i++) {
                            if ((response.body().get(i).getStatus()).equals("approved")) {
                                dataListAppointment.add(response.body().get(i));
                                Log.d(TAG, "onResponse: approved data = "+dataListAppointment.get(0).getPurpose());
                                Log.d(TAG, "onResponse: approved data link = "+dataListAppointment.get(0).getGoogleEventLink());
                                rvAdapter.notifyDataSetChanged();

                            }
                        }

                    } else if (type.equals(getString(R.string.appointment_type_pending))) {
                        spinner.setVisibility(View.GONE);

                        for (int i = 0; i < response.body().size(); i++) {
                            if ((response.body().get(i).getStatus()).equals("pending")) {
                                dataListAppointment.add(response.body().get(i));
                                Log.d(TAG, "onResponse: pending data = "+dataListAppointment.get(0).getPurpose());

                                rvAdapter.notifyDataSetChanged();

                            }
                        }

                    } else if (type.equals(getString(R.string.appointment_type_past))) {
                        spinner.setVisibility(View.GONE);

                        for (int i = 0; i < response.body().size(); i++) {
                            if ((response.body().get(i).getStatus()).equals("past")) {
                                dataListAppointment.add(response.body().get(i));
                                rvAdapter.notifyDataSetChanged();

                            }
                        }
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            @Override
            public void onFailure(Call<ArrayList<Appointment>> call, Throwable t) {
                t.printStackTrace();
                Log.d(TAG, "onFailure: Retrofit call failed: ");
            }
        });
    }
}
