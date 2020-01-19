package com.test.myapplication;

import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.graphics.Color;
import android.preference.DialogPreference;
import android.support.v7.app.AlertDialog;
import android.support.v7.widget.RecyclerView;
import android.text.Html;
import android.text.method.LinkMovementMethod;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import com.test.myapplication.models.appointments.Appointment;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;

/**
 * Created by NehaRege on 10/21/17.
 */
public class CustomRvAdapter extends RecyclerView.Adapter<CustomRvAdapter.SampleViewHolder> {
    private static final String TAG = "CustomRvAdapter";

    private ArrayList<Appointment> data;

    private static OnRecyclerViewItemClickListener onItemClickListener;

    private Context appContext;


    public CustomRvAdapter(ArrayList<Appointment> inComingData,
                           OnRecyclerViewItemClickListener listener) {
        this.onItemClickListener = listener;

        if (inComingData != null) {
            this.data = inComingData;
            Log.d(TAG, "CustomRvAdapter: data not null = "+inComingData.size());
        } else {
            Log.d(TAG, "CustomRvAdapter: data null");
            this.data = new ArrayList<>();
            Log.d(TAG, "CustomRvAdapter: data = " + data.get(0).getPurpose());
        }
    }

    @Override
    public SampleViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        Context context = parent.getContext();
        appContext = parent.getContext();
        LayoutInflater inflater = LayoutInflater.from(context);

        View listItemLayout = inflater.inflate(R.layout.rv_list_item, parent, false);

        return new SampleViewHolder(listItemLayout);
    }

    @Override
    public void onBindViewHolder(SampleViewHolder holder, int position) {

        final Appointment dataItem = data.get(position);

        TextView textViewPurpose = holder.textViewPurpose;
        TextView textViewDate = holder.textViewDate;
        TextView textViewClickMe = holder.textViewClickMe;
        TextView textViewLocation = holder.textViewLocation;
        View viewLine = holder.viewLine;
        ImageView imageView = holder.imageView;

        imageView.setImageResource(R.drawable.ic_menu_calendar);
        textViewPurpose.setText(dataItem.getPurpose());
//        textViewLocation.setText(dataItem.getLocation());
        textViewLocation.setText("");

        String googleEventLink = dataItem.getGoogleEventLink();
        if (googleEventLink != null) {
            Log.d(TAG, "onBindViewHolder: google event link not null ");
            textViewClickMe.setText(Html.fromHtml("<a href=" + dataItem.getGoogleEventLink() + "> CLICK ME "));
            textViewClickMe.setMovementMethod(LinkMovementMethod.getInstance());

        } else {
            Log.d(TAG, "onBindViewHolder: google event link = null ");

//            textViewClickMe.setTextColor(Color.parseColor("#c67100"));
            textViewClickMe.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {

                    String dtStart = dataItem.getDate();
                    String appDate = "";

                    SimpleDateFormat formatDate = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ");
                    try {
                        Date date = formatDate.parse(dtStart.replaceAll("Z$", "+0000"));
                        final DateFormat dateFormat = DateFormat.getDateInstance(DateFormat.MEDIUM);
                        dateFormat.format(Calendar.getInstance().getTime());
                        appDate = dateFormat.format(date);
                        Log.d(TAG, "onClick: -------------------------");
                        Log.d(TAG, "onClick: date = " + appDate);

                    } catch (ParseException e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }

                    String timeStart = dataItem.getStartTime();

                    String appTime = "";

                    SimpleDateFormat formatTime = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ");
                    try {
                        Date date = formatTime.parse(timeStart.replaceAll("Z$", "+0000"));
                        DateFormat timeFormatter = new SimpleDateFormat("HH:mm:ss");
                        appTime = timeFormatter.format(date);
                        Log.d(TAG, "onClick: -------------------------");
                        Log.d(TAG, "onClick: time = " + appTime);

                    } catch (ParseException e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }


//                    final DateFormat dateFormat = DateFormat.getDateInstance(DateFormat.MEDIUM);
//
//                    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
//
//                    String simpleDateFormatDate = simpleDateFormat.format(calendar.getTime());
//
//                    dateFormat.format(calendar.getTime());
//                    String date = dateFormat.format(calendar.getTime());
//
//                    buttonDate.setText(date);

                    showAppointmentDetailsDialog(
                            dataItem.getPurpose(),
                            dataItem.getDoctorName(),
                            dataItem.getDoctorId(),
                            appDate,
                            appTime,
                            dataItem.getLocation()
                    );
                }
            });
        }

        textViewDate.setText("");

    }

    private void showAppointmentDetailsDialog(String title, String name, String email, String date, String time, String location) {

//        Log.d(TAG, "showAppointmentDetailsDialog: ");
//
//        LayoutInflater inflater = LayoutInflater.from(appContext);
//        View dialogLayout = inflater.inflate(R.layout.custom_dialog_list_view, null);
//        final AlertDialog.Builder builder = new AlertDialog.Builder(appContext);
//        builder.setView(dialogLayout);
//        builder.setTitle(title);
//
//        TextView textViewDoctorName = (TextView) dialogLayout.findViewById(R.id.dialog_doctor_name);
//        TextView textViewDoctorEmail = (TextView) dialogLayout.findViewById(R.id.dialog_doctor_email);
//        TextView textViewDate = (TextView) dialogLayout.findViewById(R.id.dialog_appointment_date);
//        TextView textViewTime = (TextView) dialogLayout.findViewById(R.id.dialog_app_time);
//        TextView textViewLocation = (TextView) dialogLayout.findViewById(R.id.dialog_app_location);
//
//        textViewDoctorName.setText(name);
//        textViewDoctorEmail.setText(email);
//        textViewDate.setText(date);
//        textViewTime.setText(time);
//        textViewLocation.setText(location);
//
//        builder.setNegativeButton("OK", new DialogInterface.OnClickListener() {
//            @Override
//            public void onClick(DialogInterface dialogInterface, int i) {
//                dialogInterface.dismiss();
//            }
//        });


        final Dialog dialog = new Dialog(appContext);
        dialog.setContentView(R.layout.custom_dialog_list_view);

        dialog.setTitle(title);

        TextView textViewDoctorName = (TextView) dialog.findViewById(R.id.dialog_doctor_name);
        TextView textViewDoctorEmail = (TextView) dialog.findViewById(R.id.dialog_doctor_email);
        TextView textViewDate = (TextView) dialog.findViewById(R.id.dialog_appointment_date);
        TextView textViewTime = (TextView) dialog.findViewById(R.id.dialog_app_time);
        TextView textViewLocation = (TextView) dialog.findViewById(R.id.dialog_app_location);

        TextView textViewTitle = (TextView) dialog.findViewById(R.id.dialog_app_title);

        textViewTitle.setText(title);
        textViewDoctorName.setText(name);
        textViewDoctorEmail.setText(email);
        textViewDate.setText(date);
        textViewTime.setText(time);
        textViewLocation.setText(location);

        Button ok = (Button) dialog.findViewById(R.id.dialog_app_ok);

        ok.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dialog.dismiss();
            }
        });

        dialog.show();
    }

    @Override
    public int getItemCount() {
        return data.size();
    }

    public static class SampleViewHolder extends RecyclerView.ViewHolder {

        public ImageView imageView;
        public TextView textViewPurpose;
        public TextView textViewDate;
        public TextView textViewLocation;
        public TextView textViewClickMe;
        public View viewLine;

        public SampleViewHolder(View itemView) {
            super(itemView);

            textViewPurpose = (TextView) itemView.findViewById(R.id.list_item_text_purpose);
            textViewDate = (TextView) itemView.findViewById(R.id.list_item_text_date);
            textViewClickMe = (TextView) itemView.findViewById(R.id.list_item_text_click_me);
            textViewLocation = (TextView) itemView.findViewById(R.id.list_item_text_location_rv);
            imageView = (ImageView) itemView.findViewById(R.id.list_item_image_view);

            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    /**
                     * Whenever the custom item layout is clicked, we pass the layout and position
                     * to whoever implemented the OnRecyclerViewItemClickListener ( i.e our Activity )
                     *
                     * Note: getLayoutPosition() returns the list item position in the RecyclerView
                     */
                    onItemClickListener.onItemClick(getLayoutPosition());
                }
            });
        }
    }

    public interface OnRecyclerViewItemClickListener {
        void onItemClick(int position);
    }
}
