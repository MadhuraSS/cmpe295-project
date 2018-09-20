package com.test.myapplication.models.user;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class MedicalRecord {

    @SerializedName("ethnicity")
    @Expose
    private String ethnicity;
    @SerializedName("gender")
    @Expose
    private String gender;
    @SerializedName("age")
    @Expose
    private Integer age;
    @SerializedName("family_medical_history")
    @Expose
    private FamilyMedicalHistory familyMedicalHistory;
    @SerializedName("personal_medical_history")
    @Expose
    private PersonalMedicalHistory personalMedicalHistory;

    public String getEthnicity() {
        return ethnicity;
    }

    public void setEthnicity(String ethnicity) {
        this.ethnicity = ethnicity;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public FamilyMedicalHistory getFamilyMedicalHistory() {
        return familyMedicalHistory;
    }

    public void setFamilyMedicalHistory(FamilyMedicalHistory familyMedicalHistory) {
        this.familyMedicalHistory = familyMedicalHistory;
    }

    public PersonalMedicalHistory getPersonalMedicalHistory() {
        return personalMedicalHistory;
    }

    public void setPersonalMedicalHistory(PersonalMedicalHistory personalMedicalHistory) {
        this.personalMedicalHistory = personalMedicalHistory;
    }

}