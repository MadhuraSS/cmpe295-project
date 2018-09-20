package com.test.myapplication.models.predictions;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class Predictions {

    @SerializedName("disease")
    @Expose
    private String disease;
    @SerializedName("description")
    @Expose
    private String description;

    public String getDisease() {
        return disease;
    }

    public void setDisease(String disease) {
        this.disease = disease;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "Predictions{" +
                "disease='" + disease + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}