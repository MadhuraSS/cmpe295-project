package com.test.myapplication.models.user;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class FamilyMedicalHistory {

    @SerializedName("alcoholism")
    @Expose
    private String alcoholism;
    @SerializedName("cancer")
    @Expose
    private String cancer;
    @SerializedName("epilepsy_seizures")
    @Expose
    private String epilepsySeizures;
    @SerializedName("high_blood_pressure")
    @Expose
    private String highBloodPressure;
    @SerializedName("migraine_headaches")
    @Expose
    private String migraineHeadaches;
    @SerializedName("stroke")
    @Expose
    private String stroke;
    @SerializedName("psychiatric_problems")
    @Expose
    private String psychiatricProblems;
    @SerializedName("bleeding_problems")
    @Expose
    private String bleedingProblems;
    @SerializedName("diabetes_high_blood_sugar)")
    @Expose
    private String diabetesHighBloodSugar;
    @SerializedName("heart_disease")
    @Expose
    private String heartDisease;
    @SerializedName("high_cholesterol")
    @Expose
    private String highCholesterol;
    @SerializedName("sickle_cell_disease")
    @Expose
    private String sickleCellDisease;
    @SerializedName("thyroid_disease")
    @Expose
    private String thyroidDisease;
    @SerializedName("tuberculosis")
    @Expose
    private String tuberculosis;
    @SerializedName("arthritis")
    @Expose
    private String arthritis;
    @SerializedName("nervous_breakdown")
    @Expose
    private String nervousBreakdown;
    @SerializedName("other")
    @Expose
    private String other;
    @SerializedName("comments")
    @Expose
    private String comments;

    public String getAlcoholism() {
        return alcoholism;
    }

    public void setAlcoholism(String alcoholism) {
        this.alcoholism = alcoholism;
    }

    public String getCancer() {
        return cancer;
    }

    public void setCancer(String cancer) {
        this.cancer = cancer;
    }

    public String getEpilepsySeizures() {
        return epilepsySeizures;
    }

    public void setEpilepsySeizures(String epilepsySeizures) {
        this.epilepsySeizures = epilepsySeizures;
    }

    public String getHighBloodPressure() {
        return highBloodPressure;
    }

    public void setHighBloodPressure(String highBloodPressure) {
        this.highBloodPressure = highBloodPressure;
    }

    public String getMigraineHeadaches() {
        return migraineHeadaches;
    }

    public void setMigraineHeadaches(String migraineHeadaches) {
        this.migraineHeadaches = migraineHeadaches;
    }

    public String getStroke() {
        return stroke;
    }

    public void setStroke(String stroke) {
        this.stroke = stroke;
    }

    public String getPsychiatricProblems() {
        return psychiatricProblems;
    }

    public void setPsychiatricProblems(String psychiatricProblems) {
        this.psychiatricProblems = psychiatricProblems;
    }

    public String getBleedingProblems() {
        return bleedingProblems;
    }

    public void setBleedingProblems(String bleedingProblems) {
        this.bleedingProblems = bleedingProblems;
    }

    public String getDiabetesHighBloodSugar() {
        return diabetesHighBloodSugar;
    }

    public void setDiabetesHighBloodSugar(String diabetesHighBloodSugar) {
        this.diabetesHighBloodSugar = diabetesHighBloodSugar;
    }

    public String getHeartDisease() {
        return heartDisease;
    }

    public void setHeartDisease(String heartDisease) {
        this.heartDisease = heartDisease;
    }

    public String getHighCholesterol() {
        return highCholesterol;
    }

    public void setHighCholesterol(String highCholesterol) {
        this.highCholesterol = highCholesterol;
    }

    public String getSickleCellDisease() {
        return sickleCellDisease;
    }

    public void setSickleCellDisease(String sickleCellDisease) {
        this.sickleCellDisease = sickleCellDisease;
    }

    public String getThyroidDisease() {
        return thyroidDisease;
    }

    public void setThyroidDisease(String thyroidDisease) {
        this.thyroidDisease = thyroidDisease;
    }

    public String getTuberculosis() {
        return tuberculosis;
    }

    public void setTuberculosis(String tuberculosis) {
        this.tuberculosis = tuberculosis;
    }

    public String getArthritis() {
        return arthritis;
    }

    public void setArthritis(String arthritis) {
        this.arthritis = arthritis;
    }

    public String getNervousBreakdown() {
        return nervousBreakdown;
    }

    public void setNervousBreakdown(String nervousBreakdown) {
        this.nervousBreakdown = nervousBreakdown;
    }

    public String getOther() {
        return other;
    }

    public void setOther(String other) {
        this.other = other;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

}