package com.marian.demo.repository;

import com.marian.demo.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Integer> {
    
    // Custom query to find items based on their active status (0 or 1)
    List<Item> findByActive(int active); // Use int to match the database values (0 or 1)
    // Query to count the active items (bids)
    @Query("SELECT COUNT(i) FROM Item i WHERE i.active = 1")
    Long countActiveItems();
}
