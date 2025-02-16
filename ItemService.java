package com.marian.demo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.marian.demo.model.Item;
import com.marian.demo.model.User;
import com.marian.demo.repository.ItemRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ItemService {
    @Autowired
    private ItemRepository itemRepository;

    // Method to upload a new item
    
    public Item uploadItem(Item item, User seller) {
        try {
            item.setSeller(seller);
            
            if (item.getAuctionStartTime() != null && item.getAuctionStartTime().isBefore(LocalDateTime.now())) {
                item.setActive(1);
            } else {
                item.setActive(0);
            }

            Item savedItem = itemRepository.save(item);
            System.out.println("Item uploaded successfully: " + savedItem);
            return savedItem;
        } catch (Exception e) {
            e.printStackTrace(); // Print stack trace in logs
            System.out.println("Error while uploading item: " + e.getMessage());
            return null; // Handle error gracefully
        }
    }



    public List<Item> getAllItems() {
        try {
            System.out.println("Fetching all items...");
            List<Item> items = itemRepository.findAll();
            System.out.println("Retrieved items: " + items);
            return items;
        } catch (Exception e) {
            e.printStackTrace(); // Log the full error
            throw new RuntimeException("Error retrieving items: " + e.getMessage());
        }
    }


    // Method to get an item by ID
    public Optional<Item> getItemById(Integer itemId) {
        return itemRepository.findById(itemId);
    }

    // Method to get all items by their active status
    public List<Item> getItemsByStatus(int active) {
        return itemRepository.findByActive(active); // Uses repository query to fetch items by status
    }

    // Method to update item statuses based on auction end time
    @Transactional
    public List<Item> updateItemsByStatus(int status) {
        List<Item> items = itemRepository.findByActive(status);

        // Get the current time using LocalDateTime
        LocalDateTime now = LocalDateTime.now();

        items.forEach(item -> {
            // Check if the auction has ended by comparing with the auction end time
            if (item.getAuctionEndTime().isBefore(now) && item.getActive() == 1) {
                item.setActive(0); // Mark as inactive if auction has ended
                itemRepository.save(item); // Save the updated item status
            }
        });

        return itemRepository.findByActive(status);
    }
    public Long getActiveBidsCount() {
        return itemRepository.countActiveItems();
    }
}