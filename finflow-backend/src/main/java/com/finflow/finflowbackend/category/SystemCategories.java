package com.finflow.finflowbackend.category;

import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SystemCategories {

    /**
     * Default system categories shown to every new user.
     * We only store definitions here (name/icon/color); actual DB rows are created per user.
     */
    public record SystemCategoryDef(String name, String icon, String colorHex) {}

    // Icons are kept as unicode escapes to avoid relying on source encoding.
    private static final List<SystemCategoryDef> SYSTEM_CATEGORIES = List.of(
            new SystemCategoryDef("Food", "\ud83c\udf54", "#FF0000"),
            new SystemCategoryDef("Income", "\ud83d\udcb0", "#00FF00"),
            new SystemCategoryDef("Transportation", "\ud83d\ude97", "#00FF00"),
            new SystemCategoryDef("Housing", "\ud83c\udfe0", "#0000FF"),
            new SystemCategoryDef("Bills & Utilities", "\ud83d\udca1", "#FFFF00"),
            new SystemCategoryDef("Entertainment", "\ud83c\udf89", "#FF00FF"),
            new SystemCategoryDef("Healthcare", "\ud83c\udfe5", "#FF00FF"),
            new SystemCategoryDef("Education", "\ud83c\udf93", "#FF00FF"),
            new SystemCategoryDef("Shopping", "\ud83d\udecd\ufe0f", "#FF00FF"),
            new SystemCategoryDef("Travel", "\ud83c\udf0d", "#FF00FF"),
            new SystemCategoryDef("Debt", "\ud83d\udcb3", "#FF00FF"),
            new SystemCategoryDef("Personal Care", "\ud83d\udc86\u200d\u2642\ufe0f", "#FF00FF"),
            new SystemCategoryDef("Savings & Investment", "\ud83d\udcb5", "#FF00FF"),
            new SystemCategoryDef("Transfer", "\ud83d\udcb8", "#FF00FF"),
            new SystemCategoryDef("Taxes", "$", "#FF00FF"),
            new SystemCategoryDef("Gifts & Donations", "\ud83c\udf81", "#FF00FF"),
            new SystemCategoryDef("Miscellaneous", "\u2757\ufe0f", "#FF00FF")
    );

    public List<SystemCategoryDef> getSystemCategories() {
        return SYSTEM_CATEGORIES;
    }
}
