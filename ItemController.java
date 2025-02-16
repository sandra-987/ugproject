package com.marian.demo.controller;

import com.marian.demo.model.Auction;
import com.marian.demo.model.Item;
import com.marian.demo.model.User;
import com.marian.demo.repository.AuctionRepository;
import com.marian.demo.repository.ProjectRepository;
import com.marian.demo.services.BidService;
import com.marian.demo.services.ItemService;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/items")
public class ItemController {

    @Autowired
    private ItemService itemService;
    @Autowired
    private BidService bidService; 

    @Autowired
    private AuctionRepository auctionRepository; // Inject AuctionRepository

    // Endpoint to upload a new item
    @Autowired
    private ProjectRepository projectRepository; // Assuming ProjectRepository interacts with User or Seller

    @PostMapping("/upload")
    public ResponseEntity<Item> uploadItem(@RequestBody Item item, @RequestParam("sellerId") int sellerId) {
        // Retrieve the seller (User) from ProjectRepository
        Optional<User> sellerOptional = projectRepository.findByIdAndRole(sellerId, 2);
        if (!sellerOptional.isPresent()) {
            return ResponseEntity.badRequest().body(null); // Return error if no seller found
        }
        User seller = sellerOptional.get();

        // Save the item and associate it with the seller
        Item savedItem = itemService.uploadItem(item, seller);

        // Log the item saved
        System.out.println("Item uploaded: " + savedItem);

        // Create the auction record
        Auction auction = new Auction();
        auction.setItem(savedItem);  // Link item to auction
        auction.setStartTime(item.getAuctionStartTime()); // Set auction start time
        auction.setEndTime(item.getAuctionEndTime()); // Set auction end time
        auction.setStartingPrice(item.getStartingPrice()); // Set auction starting price
        auction.setIsActive(1); // Mark auction as active

        // Log auction details
        System.out.println("Creating auction: " + auction);

        try {
            // Save the auction record
            auctionRepository.save(auction);
            System.out.println("Auction saved: " + auction);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null); // Internal Server Error response if exception occurs
        }

        // Return the saved item as response
        return ResponseEntity.ok(savedItem);
    }


    // Endpoint to get all items
    @GetMapping("/all")
    public ResponseEntity<List<Item>> getAllItems() {
        List<Item> items = itemService.getAllItems();
        return ResponseEntity.ok(items);
    }

    // Endpoint to get an item by ID
    @GetMapping("/{id}")
    public ResponseEntity<Item> getItemById(@PathVariable Integer id) {
        Optional<Item> item = itemService.getItemById(id);
        return item.map(ResponseEntity::ok)
                   .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Endpoint to get all active items (auctions)
    @GetMapping("/active")
    public ResponseEntity<List<Map<String, Object>>> getActiveItems() {
        List<Item> activeItems = itemService.getItemsByStatus(1);
        
        List<Map<String, Object>> response = activeItems.stream().map(item -> {
            Map<String, Object> itemMap = new HashMap<>();
            itemMap.put("itemId", item.getItemId());
            itemMap.put("name", item.getName());
            itemMap.put("description", item.getDescription());
            itemMap.put("startingPrice", item.getStartingPrice());
            itemMap.put("auctionEndTime", item.getAuctionEndTime());

            // Fetch last bid amount
            Double lastBidAmount = bidService.getLastBidAmountByItemId(item.getItemId());
            itemMap.put("lastBidAmount", lastBidAmount != null ? lastBidAmount : item.getStartingPrice());

            return itemMap;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }


    // Endpoint to get all inactive items (auctions)
    @GetMapping("/inactive")
    public ResponseEntity<List<Item>> getInactiveItems() {
        // Fetch items with status 0 (inactive)
        List<Item> inactiveItems = itemService.getItemsByStatus(0);
        return ResponseEntity.ok(inactiveItems);
    }

    // Endpoint to update the status of items (active -> inactive)
    @PostMapping("/update-status")
    public ResponseEntity<List<Item>> updateItemStatuses() {
        // Update items with status 1 (active) to status 0 (inactive)
        List<Item> updatedItems = itemService.updateItemsByStatus(1);
        return ResponseEntity.ok(updatedItems);
    }

    // Endpoint to get count of active bids
    @GetMapping("/active-bids-count")
    public ResponseEntity<Long> getActiveBidsCount() {
        Long activeBidsCount = itemService.getActiveBidsCount();
        return ResponseEntity.ok(activeBidsCount);
    }
}
