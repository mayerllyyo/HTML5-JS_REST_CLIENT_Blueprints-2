/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.blueprints.services;

import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.model.Point;
import edu.eci.arsw.blueprints.persistence.BlueprintNotFoundException;
import edu.eci.arsw.blueprints.persistence.BlueprintPersistenceException;
import edu.eci.arsw.blueprints.persistence.BlueprintsPersistence;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author hcadavid
 */
@Service
public class BlueprintsServices {

    private final BlueprintsPersistence bpp;

    @Autowired
    public BlueprintsServices(BlueprintsPersistence bpp){
        this.bpp = bpp;
    }

    public void addNewBlueprint(Blueprint bp){
        try{
            bpp.saveBlueprint(bp);
        }
        catch (BlueprintPersistenceException e){
            System.out.println("Unable to save that Blueprint"+ e.getMessage());
        }

    }

    public Set<Blueprint> getAllBlueprints() throws BlueprintNotFoundException {
        try {
            Set<Blueprint> blueprints = bpp.getAllBlueprints();
            if (blueprints == null || blueprints.isEmpty()) {
                throw new BlueprintNotFoundException("No blueprints found");
            }
            return blueprints;
        } catch (BlueprintPersistenceException e) {
            throw new BlueprintNotFoundException("Error retrieving blueprints", e);
        }
    }

    /**
     * @param author blueprint's author
     * @param name blueprint's name
     * @return the blueprint of the given name created by the given author
     * @throws BlueprintNotFoundException if there is no such blueprint
     */
    public Blueprint getBlueprint(String author, String name) throws BlueprintNotFoundException {
        try {
            Blueprint blueprint = bpp.getBlueprint(author, name);
            if (blueprint == null) {
                throw new BlueprintNotFoundException("Blueprint not found: " + author + "/" + name);
            }
            return blueprint;
        } catch (BlueprintNotFoundException e) {
            throw e;
        }
    }

    /**
     * @param author blueprint's author
     * @return all the blueprints of the given author
     * @throws BlueprintNotFoundException if the given author doesn't exist
     */
    public Set<Blueprint> getBlueprintsByAuthor(String author) throws BlueprintNotFoundException{
        try{
            Set<Blueprint> blueprints = bpp.getBlueprintsByAuthor(author);
            if (blueprints == null || blueprints.isEmpty()) {
                throw new BlueprintNotFoundException("No blueprints found for author: " + author);
            }
            return blueprints;
        }
        catch(BlueprintNotFoundException e){
            throw e;
        }
    }

    /**
     * Update an existing plan
     * @param author The blueprint author
     * @param name The blueprint name
     * @param updatedBlueprint The blueprint with the updated data
     * @throws BlueprintNotFoundException if the blueprint doesn't exist
     * @throws BlueprintPersistenceException if there is a persistence error
     */
    public void updateBlueprint(String author, String name, Blueprint updatedBlueprint)
            throws BlueprintNotFoundException, BlueprintPersistenceException {
        try {
            Blueprint existingBlueprint = bpp.getBlueprint(author, name);
            if (existingBlueprint == null) {
                throw new BlueprintNotFoundException("Blueprint not found: " + author + "/" + name);
            }

            bpp.updateBlueprint(author, name, updatedBlueprint);
        } catch (BlueprintNotFoundException e) {
            throw e;
        }
    }
}
