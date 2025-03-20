package com.smartcampus.service;

import com.smartcampus.dto.ResourceDTO;
import com.smartcampus.model.Resource;
import com.smartcampus.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public Optional<Resource> getResourceById(Long id) {
        return resourceRepository.findById(id);
    }

    public Resource createResource(Resource resource) {
        return resourceRepository.save(resource);
    }

    public Resource updateResource(Long id, Resource resource) {
        if (resourceRepository.existsById(id)) {
            resource.setId(id);
            return resourceRepository.save(resource);
        }
        return null;
    }

    public boolean deleteResource(Long id) {
        if (resourceRepository.existsById(id)) {
            resourceRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<ResourceDTO> getAllResourcesIdAndName() {
        return resourceRepository.findAll()
                .stream()
                .filter(resource -> "Available".equals(resource.getStatus()))
                .map(resource -> new ResourceDTO(resource.getId(), resource.getName()))
                .collect(Collectors.toList());
    }

}
