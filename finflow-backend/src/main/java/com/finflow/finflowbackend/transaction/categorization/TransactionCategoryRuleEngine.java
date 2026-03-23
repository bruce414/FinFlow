package com.finflow.finflowbackend.transaction.categorization;

import com.finflow.finflowbackend.common.enums.CounterpartyType;
import com.finflow.finflowbackend.common.enums.TransactionDirection;
import com.finflow.finflowbackend.common.enums.TransactionType;
import org.springframework.stereotype.Component;

import java.util.Locale;
import java.util.Objects;

/**
 * Deterministic, ordered rule set. First matching rule wins; otherwise {@link #FALLBACK_CATEGORY}.
 * Category names must match {@link com.finflow.finflowbackend.category.SystemCategories} exactly.
 */
@Component
public class TransactionCategoryRuleEngine {

    static final String FALLBACK_CATEGORY = "Miscellaneous";

    private static final String TRANSFER = "Transfer";
    private static final String INCOME = "Income";
    private static final String TAXES = "Taxes";
    private static final String GIFTS_DONATIONS = "Gifts & Donations";
    private static final String BILLS_UTILITIES = "Bills & Utilities";
    private static final String HOUSING = "Housing";
    private static final String TRANSPORTATION = "Transportation";
    private static final String FOOD = "Food";
    private static final String HEALTHCARE = "Healthcare";
    private static final String EDUCATION = "Education";
    private static final String ENTERTAINMENT = "Entertainment";
    private static final String TRAVEL = "Travel";
    private static final String SAVINGS_INVESTMENT = "Savings & Investment";
    private static final String DEBT = "Debt";
    private static final String PERSONAL_CARE = "Personal Care";
    private static final String SHOPPING = "Shopping";

    /**
     * @param direction null when {@code transactionType == TRANSFER}
     */
    public String resolveCategoryName(
            TransactionType transactionType,
            TransactionDirection direction,
            CounterpartyType counterpartyType,
            String counterpartyName,
            String reference
    ) {
        Objects.requireNonNull(transactionType, "transactionType");
        Objects.requireNonNull(counterpartyType, "counterpartyType");

        if (transactionType == TransactionType.TRANSFER) {
            return TRANSFER;
        }

        String haystack = buildHaystack(counterpartyName, reference);

        if (containsAny(haystack, "payroll", "salary", "pay cheque", "paycheck", "direct dep", "direct deposit", "wage", "pay run")) {
            return INCOME;
        }
        if (containsAny(haystack, "irs", "hmrc", "cra ", "tax office", "property tax", "income tax", "state tax", "federal tax", "vat payment", "estimated tax")) {
            return TAXES;
        }
        if (containsAny(haystack, "donation", "charity", "nonprofit", "non-profit", "red cross", "unicef", "unhcr", "gofundme")) {
            return GIFTS_DONATIONS;
        }
        if (containsAny(haystack,
                "electric", "electricity", "water bill", "sewer", "gas bill", "internet", "broadband", "wifi", "fiber",
                "phone bill", "mobile bill", "cellular", "verizon", "at&t", "att ", "t-mobile", "tmobile",
                "comcast", "spectrum", "xfinity", "utility", "utilities")) {
            return BILLS_UTILITIES;
        }
        if (containsAny(haystack, "rent", "landlord", "lease", "hoa", "hoa dues", "mortgage", "property mgmt", "property management", "apartment")) {
            return HOUSING;
        }
        if (containsAny(haystack,
                "uber", "lyft", "taxi", "transit", "metro", "subway pass", "bus pass", "parking", "toll ",
                "shell ", "chevron", "exxon", "bp ", "gas station", "petrol")) {
            return TRANSPORTATION;
        }
        if (containsAny(haystack,
                "restaurant", "cafe", "coffee", "starbucks", "mcdonald", "burger", "doordash", "grubhub", "uber eats",
                "instacart", "whole foods", "trader joe", "kroger", "safeway", "publix", "grocery", "supermarket",
                "bakery", "pizza", "deli")) {
            return FOOD;
        }
        if (containsAny(haystack,
                "pharmacy", "cvs", "walgreens", "hospital", "clinic", "dental", "dentist", "medical", "doctor",
                "physician", "urgent care", "labcorp", "lab corp", "radiology")) {
            return HEALTHCARE;
        }
        if (containsAny(haystack, "tuition", "university", "college", "school fee", "coursera", "udemy", "edx")) {
            return EDUCATION;
        }
        if (containsAny(haystack,
                "netflix", "spotify", "hulu", "disney+", "hbo", "prime video", "cinema", "theater", "theatre",
                "movie", "steam", "playstation", "xbox", "nintendo", "concert", "ticketmaster")) {
            return ENTERTAINMENT;
        }
        if (containsAny(haystack,
                "airline", "airbnb", "hotel", "marriott", "hilton", "hyatt", "expedia", "booking.com",
                "delta air", "united air", "american air", "southwest air", "lufthansa", "ryanair")) {
            return TRAVEL;
        }
        if (containsAny(haystack,
                "interest earned", "dividend", "401k", "ira ", "brokerage", "fidelity", "vanguard", "schwab",
                "robinhood", "etrade", "e-trade", "mutual fund", "etf purchase", "stock purchase")) {
            return SAVINGS_INVESTMENT;
        }
        if (containsAny(haystack,
                "credit card", "card payment", "loan payment", "auto loan", "car loan", "student loan",
                "personal loan", "line of credit", "visa payment", "mastercard payment", "amex payment")) {
            return DEBT;
        }
        if (containsAny(haystack, "salon", "barber", "spa ", "gym", "fitness", "planet fitness", "yoga", "pilates")) {
            return PERSONAL_CARE;
        }
        if (containsAny(haystack, "amazon", "target", "walmart", "ebay", "etsy", "costco", "best buy", "ikea")) {
            return SHOPPING;
        }

        if (counterpartyType == CounterpartyType.Government) {
            return TAXES;
        }

        if (counterpartyType == CounterpartyType.BANK) {
            if (direction == TransactionDirection.IN) {
                return INCOME;
            }
            return FALLBACK_CATEGORY;
        }
        if (counterpartyType == CounterpartyType.PERSON) {
            if (direction == TransactionDirection.IN) {
                return INCOME;
            }
            return FALLBACK_CATEGORY;
        }
        if (counterpartyType == CounterpartyType.MERCHANT) {
            return FALLBACK_CATEGORY;
        }
        return FALLBACK_CATEGORY;
    }

    private static String buildHaystack(String counterpartyName, String reference) {
        String cp = counterpartyName == null ? "" : counterpartyName.toLowerCase(Locale.ROOT).trim();
        String ref = reference == null ? "" : reference.toLowerCase(Locale.ROOT).trim();
        if (ref.isEmpty()) {
            return " " + cp + " ";
        }
        return " " + cp + " " + ref + " ";
    }

    private static boolean containsAny(String haystack, String... needles) {
        for (String n : needles) {
            if (haystack.contains(n)) {
                return true;
            }
        }
        return false;
    }
}
