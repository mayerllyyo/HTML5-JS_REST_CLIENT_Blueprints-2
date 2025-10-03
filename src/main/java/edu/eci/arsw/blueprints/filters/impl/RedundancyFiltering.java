package edu.eci.arsw.blueprints.filters.impl;

import edu.eci.arsw.blueprints.filters.BlueprintFilter;
import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.model.Point;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class RedundancyFiltering implements BlueprintFilter {
    @Override
    public Blueprint filter(Blueprint blueprint) {
        List<Point> filteredPoints = new ArrayList<>();
        Point prev = null;
        for (Point point : blueprint.getPoints()) {
            if (prev == null || !point.equals(prev)) {
                filteredPoints.add(point);
            }
            prev = point;
        }
        blueprint.setPoints(filteredPoints);
        return blueprint;
    }
}