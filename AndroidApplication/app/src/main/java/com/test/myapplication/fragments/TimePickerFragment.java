package com.test.myapplication.fragments;

import android.app.DatePickerDialog;
import android.app.Dialog;
import android.app.DialogFragment;
import android.app.TimePickerDialog;
import android.os.Bundle;
import android.util.Log;

import java.util.Calendar;

/**
 * Created by NehaRege on 11/7/17.
 */
public class TimePickerFragment extends DialogFragment {
    private static final String TAG = "TimePickerFragment";
    public static final String KEY_VIEW_CLICK = "KEY_VIEW_CLICK";

    public static TimePickerFragment newInstance(String clickType) {

        TimePickerFragment timePickerFragment = new TimePickerFragment();

        Bundle bundle = new Bundle();
        bundle.putString(KEY_VIEW_CLICK, clickType);

        timePickerFragment.setArguments(bundle);

        return timePickerFragment;

    }
    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {

        Log.d(TAG, "onCreateDialog: ");

        // Get a Calendar instance
        final Calendar calendar = Calendar.getInstance();
        // Get the current hour and minute
        int hour = calendar.get(Calendar.HOUR_OF_DAY);
        int minute = calendar.get(Calendar.MINUTE);

        return new TimePickerDialog(getActivity(),
                (TimePickerDialog.OnTimeSetListener)
                        getActivity(), hour, minute, true);

    }

}
