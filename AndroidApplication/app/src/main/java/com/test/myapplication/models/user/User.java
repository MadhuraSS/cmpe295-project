package com.test.myapplication.models.user;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class User {

    @SerializedName("_id")
    @Expose
    private String id;
    @SerializedName("address")
    @Expose
    private Address address;
    @SerializedName("user_type")
    @Expose
    private String userType;
    @SerializedName("phone_number")
    @Expose
    private String phoneNumber;
    @SerializedName("doctor_id")
    @Expose
    private String doctorId;
    @SerializedName("__v")
    @Expose
    private Integer v;
    @SerializedName("google_calendar_token")
    @Expose
    private GoogleCalendarToken googleCalendarToken;
    @SerializedName("medical_record")
    @Expose
    private MedicalRecord medicalRecord;
    @SerializedName("name")
    @Expose
    private Name name;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
    }

    public Integer getV() {
        return v;
    }

    public void setV(Integer v) {
        this.v = v;
    }

    public GoogleCalendarToken getGoogleCalendarToken() {
        return googleCalendarToken;
    }

    public void setGoogleCalendarToken(GoogleCalendarToken googleCalendarToken) {
        this.googleCalendarToken = googleCalendarToken;
    }

    public MedicalRecord getMedicalRecord() {
        return medicalRecord;
    }

    public void setMedicalRecord(MedicalRecord medicalRecord) {
        this.medicalRecord = medicalRecord;
    }

    public Name getName() {
        return name;
    }

    public void setName(Name name) {
        this.name = name;
    }

}