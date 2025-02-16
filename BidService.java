package com.marian.demo.services;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.marian.demo.model.Auction;
import com.marian.demo.model.Bid;
import com.marian.demo.model.User;
import com.marian.demo.repository.AuctionRepository;
import com.marian.demo.repository.BidRepository;
import com.marian.demo.repository.ProjectRepository;

@Service
public class BidService {

    @Autowired
    private BidRepository bidRepository;

    @Autowired
    private AuctionRepository auctionRepository;

    @Autowired
    private ProjectRepository projectRepository;  // Added for fetching the buyer's details

    // Place Bid
 // Place Bid
    public Bid placeBid(Bid bid) {
        Auction auction = bid.getAuction();

        if (auction.getEndTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Auction has already ended");
        }

        if (bid.getBidAmount() <= auction.getStartingPrice()) {
            throw new RuntimeException("Bid must be higher than the starting price");
        }

        // Compare with currentBidAmount
        if (auction.getCurrentBidAmount() != null && bid.getBidAmount() <= auction.getCurrentBidAmount()) {
            throw new RuntimeException("Bid must be higher than the current highest bid");
        }

        // Add the bid to the auction's bid list
        auction.getBids().add(bid);

        // Update current bid amount in auction
        auction.setCurrentBidAmount(bid.getBidAmount());
        auctionRepository.save(auction);  // Ensure the auction is updated with the new bid

        // Save the new bid separately in the bid table
        return bidRepository.save(bid);
    }


    // Place or Update Bid
    public Bid placeOrUpdateBid(int auctionId, int buyerId, double bidAmount) {
        // Fetch the auction by ID
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new RuntimeException("Auction not found"));

        // Check if the auction is still active
        if (auction.getEndTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Auction has ended");
        }

        // Validate the bid amount
        if (bidAmount <= auction.getStartingPrice()) {
            throw new RuntimeException("Bid amount must be higher than the starting price");
        }

        // Check if the buyer exists
        User buyer = projectRepository.findById(buyerId)
                .orElseThrow(() -> new RuntimeException("Buyer not found"));

        // Check if the buyer has an existing bid
        Optional<Bid> existingBid = bidRepository.findByAuctionIdAndBuyerId(auctionId, buyerId);

        if (existingBid.isPresent()) {
            // Update the existing bid
            Bid bidToUpdate = existingBid.get();
            bidToUpdate.setBidAmount(bidAmount);
            return bidRepository.save(bidToUpdate);
        } else {
            // Place a new bid
            Bid newBid = new Bid();
            newBid.setAuction(auction);
            newBid.setBuyer(buyer);
            newBid.setBidAmount(bidAmount);
            return bidRepository.save(newBid);
        }
    }
    public Double getLastBidAmountByItemId(int itemId) {
        return bidRepository.findLastBidAmountByAuctionId(itemId);
    }
    // Finalize Auction
    public void finalizeAuction(int auctionId) {
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new RuntimeException("Auction not found"));

        if (auction.getEndTime().isAfter(LocalDateTime.now())) {
            throw new RuntimeException("Auction is still ongoing");
        }

        // Fetch the highest bid
        Bid finalBid = auction.finalizeAuction();
        if (finalBid != null) {
            finalBid.setFinalBid(true);
            bidRepository.save(finalBid);
        }
    }
}
