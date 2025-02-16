package com.marian.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.marian.demo.model.Bid;
import com.marian.demo.services.BidService;

@RestController
@RequestMapping("/bids")
public class BidController {

    @Autowired
    private BidService bidService;

    // Place or Update a Bid
    @PostMapping("/placeOrUpdate")
    public ResponseEntity<String> placeOrUpdateBid(@RequestParam int auctionId, 
                                                   @RequestParam int buyerId, 
                                                   @RequestParam double bidAmount) {
        try {
            Bid bid = bidService.placeOrUpdateBid(auctionId, buyerId, bidAmount);
            return ResponseEntity.ok("Bid placed/updated successfully. Bid ID: " + bid.getId());
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body("Error: " + e.getMessage());
        }
    }
    @GetMapping("/lastBid/{auctionId}")
    public ResponseEntity<Double> getLastBid(@PathVariable int auctionId) {
        Double lastBid = bidService.getLastBidAmountByItemId(auctionId);
        return ResponseEntity.ok(lastBid != null ? lastBid : 0.0); // Return 0 if no bid exists
    }

    // Finalize Auction and Identify the Final Bid
    @PostMapping("/finalize/{auctionId}")
    public ResponseEntity<String> finalizeAuction(@PathVariable int auctionId) {
        try {
            bidService.finalizeAuction(auctionId);  // This will store the final bid in the Bid entity
            return ResponseEntity.ok("Auction finalized successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body("Error: " + e.getMessage());
        }
    }
}
