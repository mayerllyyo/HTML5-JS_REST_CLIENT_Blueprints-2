package edu.eci.arsw.blueprints.filters.impl;

import edu.eci.arsw.blueprints.filters.BlueprintFilter;
import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.model.Point;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class SubsamplingFiltering implements BlueprintFilter {
    @Override
    public Blueprint filter(Blueprint blueprint) {
        List<Point> filteredPoints = new ArrayList<>();
        List<Point> points = blueprint.getPoints();
        for (int i = 0; i < points.size(); i += 2) {
            filteredPoints.add(points.get(i));
        }
        blueprint.setPoints(filteredPoints);
        return blueprint;
    }
}