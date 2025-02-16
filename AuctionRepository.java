package com.marian.demo.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.marian.demo.model.Auction;
import com.marian.demo.model.User;

@Repository
public interface AuctionRepository extends JpaRepository<Auction, Integer> {

    // Find an auction by its ID (returns Optional)
    Optional<Auction> findById(int id);
    
    // Find all active auctions (those that have not yet ended)
    List<Auction> findByEndTimeAfterAndStartTimeBefore(LocalDateTime endTime, LocalDateTime startTime);
    
    // Find all auctions by a specific seller (now referencing the seller through the item)
    List<Auction> findByItem_Seller(User seller);  // Modified to use the seller associated with the item
    
    // Find all completed auctions (where endTime is in the past)
    List<Auction> findByEndTimeBefore(LocalDateTime now);
    
    // Find all active auctions (based on the isActive field)
    List<Auction> findByIsActive(int isActive);
    // Custom query method to check if an active auction exists for an item
    boolean existsByItem_ItemIdAndIsActive(int itemId, int isActive);
}
