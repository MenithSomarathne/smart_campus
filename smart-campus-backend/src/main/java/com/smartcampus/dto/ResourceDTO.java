package com.smartcampus.dto;

public class ResourceDTO {
    private Long id;
    private String name;

    public ResourceDTO(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}
