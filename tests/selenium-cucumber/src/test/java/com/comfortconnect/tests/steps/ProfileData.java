package com.comfortconnect.tests.steps;

import java.util.HashMap;
import java.util.Map;

/**
 * Mirrors the mockProfiles.json data so feature files can reference profiles by name.
 * SSN last-4 digits determine deterministic FICO: 550 + (last4 % 300).
 */
public class ProfileData {

    public final String firstName, lastName, email, phone, dob, ssn;
    public final String street, city, state, zip;
    public final String incomeSource;
    public final int preTaxIncome, additionalIncome, housingExpense;

    private ProfileData(String firstName, String lastName, String email, String phone,
                         String dob, String ssn, String street, String city, String state,
                         String zip, String incomeSource, int preTaxIncome,
                         int additionalIncome, int housingExpense) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.dob = dob;
        this.ssn = ssn;
        this.street = street;
        this.city = city;
        this.state = state;
        this.zip = zip;
        this.incomeSource = incomeSource;
        this.preTaxIncome = preTaxIncome;
        this.additionalIncome = additionalIncome;
        this.housingExpense = housingExpense;
    }

    private static final Map<String, ProfileData> PROFILES = new HashMap<>();

    static {
        // FICO 760 → Premier approved (primePlus)
        PROFILES.put("Alice", new ProfileData(
            "Alice", "Johnson", "alice@example.com", "5551234567",
            "03/15/1985", "111110210",
            "123 Oak St", "Austin", "TX", "78701",
            "Employed", 95000, 0, 1200
        ));

        // FICO 701 → Premier approved (prime)
        PROFILES.put("Bob", new ProfileData(
            "Bob", "Martinez", "bob@example.com", "5559876543",
            "07/22/1978", "111114651",
            "456 Maple Ave", "Denver", "CO", "80202",
            "Employed", 72000, 5000, 1500
        ));

        // FICO 630 → Review required → auto-shows loan offers
        PROFILES.put("Carol", new ProfileData(
            "Carol", "Thompson", "carol@example.com", "5555551234",
            "11/08/1990", "111110080",
            "789 Pine Rd", "Portland", "OR", "97201",
            "Self-Employed", 55000, 0, 900
        ));

        // FICO 590 → Rejected (lowFico) → loan + LTO offers
        PROFILES.put("Dan", new ProfileData(
            "Dan", "Chen", "dan@example.com", "5554443333",
            "05/20/1982", "111110040",
            "321 Elm St", "Phoenix", "AZ", "85001",
            "Employed", 48000, 0, 800
        ));

        // FICO 555 → Rejected; FICO < 560 so loan partners reject → LTO only
        PROFILES.put("Frank", new ProfileData(
            "Frank", "Rivera", "frank@example.com", "5553336666",
            "09/12/1988", "111110005",
            "555 Cedar Blvd", "Tampa", "FL", "33601",
            "Employed", 40000, 0, 700
        ));

        // FICO 750 but income $20K → underwriting rejects for income, all partners reject
        PROFILES.put("Eve", new ProfileData(
            "Eve", "Williams", "eve@example.com", "5552221111",
            "01/30/1995", "111110500",
            "999 Last Resort Ln", "Reno", "NV", "89501",
            "Other", 20000, 0, 500
        ));
    }

    public static ProfileData get(String name) {
        ProfileData data = PROFILES.get(name);
        if (data == null) {
            throw new IllegalArgumentException("Unknown test profile: " + name +
                ". Available: " + PROFILES.keySet());
        }
        return data;
    }
}
