package com.test.myapplication.models.user;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class GoogleCalendarToken {

    @SerializedName("access_token")
    @Expose
    private String accessToken;
    @SerializedName("id_token")
    @Expose
    private String idToken;
    @SerializedName("token_type")
    @Expose
    private String tokenType;
    @SerializedName("expiry_date")
    @Expose
    private Long expiryDate;

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getIdToken() {
        return idToken;
    }

    public void setIdToken(String idToken) {
        this.idToken = idToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public Long getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(Long expiryDate) {
        this.expiryDate = expiryDate;
    }

}