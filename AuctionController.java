package com.marian.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.marian.demo.model.Auction;
import com.marian.demo.services.AuctionService;

@RestController
@RequestMapping("/auctions")
public class AuctionController {

    @Autowired
    private AuctionService auctionService;

    // Activate Auction
    @PostMapping("/activate/{itemId}")
    public ResponseEntity<String> activateAuction(@PathVariable int itemId) {
        try {
            Auction auction = auctionService.activateAuction(itemId);
            return ResponseEntity.ok("Auction activated successfully for Item ID: " + itemId);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body("Error: " + e.getMessage());
        }
    }

    // Get Auction Details
    @GetMapping("/{auctionId}")
    public ResponseEntity<Auction> getAuction(@PathVariable int auctionId) {
        try {
            Auction auction = auctionService.getAuctionById(auctionId);
            return ResponseEntity.ok(auction);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(null);
        }
    }
}
