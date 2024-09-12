package com.valkylit.service.dto;

import com.valkylit.domain.enumeration.BookFormat;
import java.util.List;

public class BookCriteriaDTO {

    private List<String> authors; // Liste des noms d'auteurs
    private List<BookFormat> formats;
    private Float minPrice;
    private Float maxPrice;

    public List<String> getAuthors() {
        return authors;
    }

    public void setAuthors(List<String> authors) {
        this.authors = authors;
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
}
