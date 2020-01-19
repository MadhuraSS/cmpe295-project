package com.test.myapplication.models.appointments;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class Appointment {

    @SerializedName("_id")
    @Expose
    private String id;
    @SerializedName("patient_id")
    @Expose
    private String patientId;
    @SerializedName("patient_name")
    @Expose
    private String patientName;
    @SerializedName("doctor_id")
    @Expose
    private String doctorId;
    @SerializedName("doctor_name")
    @Expose
    private String doctorName;
    @SerializedName("purpose")
    @Expose
    private String purpose;
    @SerializedName("status")
    @Expose
    private String status;
    @SerializedName("date")
    @Expose
    private String date;
    @SerializedName("start_time")
    @Expose
    private String startTime;
    @SerializedName("end_time")
    @Expose
    private String endTime;
    @SerializedName("location")
    @Expose
    private String location;
    @SerializedName("start_time_timestamp")
    @Expose
    private Long startTimeTimestamp;
    @SerializedName("__v")
    @Expose
    private Integer v;
    @SerializedName("google_event_link")
    @Expose
    private String googleEventLink;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Long getStartTimeTimestamp() {
        return startTimeTimestamp;
    }

    public void setStartTimeTimestamp(Long startTimeTimestamp) {
        this.startTimeTimestamp = startTimeTimestamp;
    }

    public Integer getV() {
        return v;
    }

    public void setV(Integer v) {
        this.v = v;
    }

    public String getGoogleEventLink() {
        return googleEventLink;
    }

    public void setGoogleEventLink(String googleEventLink) {
        this.googleEventLink = googleEventLink;
    }

    @Override
    public String toString() {
        return "Appointment{" +
                "id='" + id + '\'' +
                ", patientId='" + patientId + '\'' +
                ", patientName='" + patientName + '\'' +
                ", doctorId='" + doctorId + '\'' +
                ", doctorName='" + doctorName + '\'' +
                ", purpose='" + purpose + '\'' +
                ", status='" + status + '\'' +
                ", date='" + date + '\'' +
                ", startTime='" + startTime + '\'' +
                ", endTime='" + endTime + '\'' +
                ", location='" + location + '\'' +
                ", startTimeTimestamp=" + startTimeTimestamp +
                ", v=" + v +
                ", googleEventLink='" + googleEventLink + '\'' +
                '}';
    }

}