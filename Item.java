package com.marian.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int itemId;

    private String name;
    private String description;
    private int active;
    private LocalDateTime auctionStartTime;
    private LocalDateTime auctionEndTime;
    private double startingPrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)  // Foreign Key to User (Seller)
    @JsonIgnore 
    private User seller; // Seller (User) associated with this item

    // Constructors, getters, and setters

    public Item() {
    }

    public Item(String name, String description, int active, LocalDateTime auctionStartTime, LocalDateTime auctionEndTime, double startingPrice, User seller) {
        this.name = name;
        this.description = description;
        this.active = active;
        this.auctionStartTime = auctionStartTime;
        this.auctionEndTime = auctionEndTime;
        this.startingPrice = startingPrice;
        this.seller = seller;
    }

    // Getters and Setters
    public int getItemId() {
        return itemId;
    }

    public void setItemId(int itemId) {
        this.itemId = itemId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getActive() {
        return active;
    }

    public void setActive(int active) {
        this.active = active;
    }

    public LocalDateTime getAuctionStartTime() {
        return auctionStartTime;
    }

    public void setAuctionStartTime(LocalDateTime auctionStartTime) {
        this.auctionStartTime = auctionStartTime;
    }

    public LocalDateTime getAuctionEndTime() {
        return auctionEndTime;
    }

    public void setAuctionEndTime(LocalDateTime auctionEndTime) {
        this.auctionEndTime = auctionEndTime;
    }

    public double getStartingPrice() {
        return startingPrice;
    }

    public void setStartingPrice(double startingPrice) {
        this.startingPrice = startingPrice;
    }

    public User getSeller() {
        return seller;
    }

    public void setSeller(User seller) {
        this.seller = seller;
    }

    @Override
    public String toString() {
        return "Item{itemId=" + itemId + ", name='" + name + "', description='" + description + "', active=" + active + 
               ", auctionStartTime=" + auctionStartTime + ", auctionEndTime=" + auctionEndTime + ", startingPrice=" + startingPrice + 
               ", seller=" + seller.getId() + '}';
    }
}
