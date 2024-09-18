package com.valkylit.service.dto;

import com.valkylit.domain.enumeration.BookFormat;
import java.util.List;

public class BookCriteriaDTO {

    private List<String> authors;
    private List<String> categories;
    private List<BookFormat> formats;
    private Float minPrice;
    private Float maxPrice;
    private String searchTerm;

    public List<String> getAuthors() {
        return authors;
    }

    public void setAuthors(List<String> authors) {
        this.authors = authors;
    }

    public List<String> getCategories() {
        return categories;
    }

    public void setCategories(List<String> categories) {
        this.categories = categories;
    }

    public List<BookFormat> getFormats() {
        return formats;
    }

    public void setFormats(List<BookFormat> formats) {
        this.formats = formats;
    }

    public Float getMinPrice() {
        return minPrice;
    }

    public void setMinPrice(Float minPrice) {
        this.minPrice = minPrice;
    }

    public Float getMaxPrice() {
        return maxPrice;
    }

    public void setMaxPrice(Float maxPrice) {
        this.maxPrice = maxPrice;
    }

    public String getSearchTerm() {
        return this.searchTerm;
    }

    public void setSearchTerm(String searchTerm) {
        this.searchTerm = searchTerm;
    }
}
