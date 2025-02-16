package com.marian.demo.repository;

import com.marian.demo.model.Auction;
import com.marian.demo.model.Bid;
import com.marian.demo.model.User;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BidRepository extends JpaRepository<Bid, Integer> {

    // Find a bid by its ID
    Bid findById(int id);
    
    // Find all bids associated with a specific auction
    List<Bid> findByAuctionId(int auctionId);
        // Custom query to get the highest bid for a specific auction, ordered by bid amount in descending order
        Optional<Bid> findTopByAuction_IdOrderByBidAmountDesc(int auctionId);

        // Find a bid by auction and buyer (to allow editing the bid)
        Optional<Bid> findByAuctionAndBuyer(Auction auction, User buyer);
        // Define the method to find a bid by auctionId and buyerId
        Optional<Bid> findByAuctionIdAndBuyerId(int auctionId, int buyerId);
        @Query("SELECT b.bidAmount FROM Bid b WHERE b.auction.id = :auctionId ORDER BY b.id DESC LIMIT 1")
        Double findLastBidAmountByAuctionId(@Param("auctionId") int auctionId);


    }
    

    // Save or update a bid (inherited from JpaRepository)
    // No need to add explicitly unless specific methods are required

