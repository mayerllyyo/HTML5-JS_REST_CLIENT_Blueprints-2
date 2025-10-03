/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.blueprints.persistence;

import edu.eci.arsw.blueprints.model.Blueprint;

import java.util.Set;

/**
 *
 * @author hcadavid
 */
public interface BlueprintsPersistence {
    
    /**
     * 
     * @param bp the new blueprint
     * @throws BlueprintPersistenceException if a blueprint with the same name already exists,
     *    or any other low-level persistence error occurs.
     */
    public void saveBlueprint(Blueprint bp) throws BlueprintPersistenceException;
    
    /**
     * 
     * @param author blueprint's author
     * @param bprintname blueprint's author
     * @return the blueprint of the given name and author
     * @throws BlueprintNotFoundException if there is no such blueprint
     */
    public Blueprint getBlueprint(String author,String bprintname) throws BlueprintNotFoundException;

    /**
     *
     * @param author blueprint's author
     * @return all blueprints of the given author
     * @throws BlueprintNotFoundException if the given author doesn't exist
     */
    public Set<Blueprint> getBlueprintsByAuthor(String author) throws BlueprintNotFoundException;

    /**
     *
     * @return all blueprints in the system
     * @throws BlueprintPersistenceException if there's an error retrieving blueprints
     */
    public Set<Blueprint> getAllBlueprints() throws BlueprintPersistenceException;

    /**
     * Updates an existing blueprint
     * @param author blueprint's author
     * @param bprintname blueprint's name
     * @param updatedBlueprint the updated blueprint data
     * @throws BlueprintNotFoundException if the blueprint doesn't exist
     * @throws BlueprintPersistenceException if there's an error updating
     */
    public void updateBlueprint(String author, String bprintname, Blueprint updatedBlueprint)
            throws BlueprintNotFoundException, BlueprintPersistenceException;
}
