package com.marian.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "auction")
public class Auction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private double startingPrice;

    @Column(name = "current_bid_amount") // New field to track the ongoing highest bid
    private Double currentBidAmount; 

    @OneToMany(mappedBy = "auction", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Bid> bids; 

    @Column(name = "is_active")
    private int isActive = 1;

    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public Item getItem() { return item; }
    public void setItem(Item item) { this.item = item; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public double getStartingPrice() { return startingPrice; }
    public void setStartingPrice(double startingPrice) { this.startingPrice = startingPrice; }

    public Double getCurrentBidAmount() { return currentBidAmount; }
    public void setCurrentBidAmount(Double currentBidAmount) { this.currentBidAmount = currentBidAmount; }

    public List<Bid> getBids() { return bids; }
    public void setBids(List<Bid> bids) { this.bids = bids; }

    public int getIsActive() { return isActive; }
    public void setIsActive(int isActive) { this.isActive = isActive; }

    public Bid finalizeAuction() {
        if (bids != null && !bids.isEmpty()) {
            Bid highestBid = bids.stream()
                    .max((b1, b2) -> Double.compare(b1.getBidAmount(), b2.getBidAmount()))
                    .orElse(null);

            if (highestBid != null) {
                highestBid.setFinalBid(true); // Mark as final bid
                this.currentBidAmount = highestBid.getBidAmount(); // Update current highest bid
            }

            return highestBid;
        }
        return null;
    }

}
