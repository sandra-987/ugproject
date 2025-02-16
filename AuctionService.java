package com.marian.demo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.marian.demo.model.Auction;
import com.marian.demo.model.Bid;
import com.marian.demo.model.Item;
import com.marian.demo.repository.AuctionRepository;
import com.marian.demo.repository.BidRepository;
import com.marian.demo.repository.ItemRepository;

import java.time.LocalDateTime;

@Service
public class AuctionService {

    private static final Logger logger = LoggerFactory.getLogger(AuctionService.class);

    @Autowired
    private AuctionRepository auctionRepository;

    @Autowired
    private BidRepository bidRepository;

    @Autowired
    private ItemRepository itemRepository;

    
    @Transactional
    public void closeAuction(int id) {
        Auction auction = auctionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Auction not found"));

        // Finalize the auction by selecting the highest bid
        Bid finalBid = auction.finalizeAuction(); 

        if (finalBid != null) {
            finalBid.setFinalBid(true); // Mark as final bid
            auction.setCurrentBidAmount(finalBid.getBidAmount()); // Update current bid amount
            bidRepository.save(finalBid); // Save final bid in Bid table

            logger.info("Auction ID {} closed. Final bid: {} by Bidder ID {}", auction.getId(), finalBid.getBidAmount(), finalBid.getBuyer().getId());
        } else {
            logger.warn("Auction ID {} closed without any bids.", auction.getId());
        }

        auction.setIsActive(0); // Mark auction as inactive
        auctionRepository.save(auction); // Save the updated auction status
    }



    public Auction getAuctionById(int id) {
        return auctionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Auction not found"));
    }

    @Transactional
    public Auction activateAuction(int itemId) {
        // Fetch the item from the items table
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        if (item.getActive() != 1) {
            throw new RuntimeException("Item is not active for auction.");
        }

        // Check if an auction already exists for this item
        if (auctionRepository.existsByItem_ItemIdAndIsActive(itemId, 1)) {
            throw new RuntimeException("An active auction already exists for this item.");
        }

        // Create a new auction entry
        Auction auction = new Auction();
        auction.setItem(item);
        auction.setStartTime(item.getAuctionStartTime() != null ? item.getAuctionStartTime() : LocalDateTime.now());
        auction.setEndTime(item.getAuctionEndTime() != null ? item.getAuctionEndTime() : LocalDateTime.now().plusDays(1)); // Default end time if not set
        auction.setStartingPrice(item.getStartingPrice());
        auction.setIsActive(1); // Mark as active

        // Save the auction
        auctionRepository.save(auction);

        logger.info("Auction activated for Item ID {}", itemId);
        return auction;
    }

}
