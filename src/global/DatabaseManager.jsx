import axios from "axios";
import React,{useState,useEffect} from "react";

export default function DatabaseManager() {
    let databaseConnection = null;
    let reconnectTimer = null;

    async function connectDatabase() {

        useEffect (() => {
            async function connectToDatabase() {
                try {
                    console.log('Connecting to the database...');
                    const response = await axios.get('http://localhost:5000/connectDatabase');
                    console.log('Database connected successfully:', response.data);
                } catch (error) {
                    console.error('Error connecting to the database:', error);
                }
            }
    
            connectToDatabase();
    
            return () => {
                closeDatabaseConnection();
            };
        }, []);


        reconnectTimer = setTimeout(() => {
            reconnectToDatabase();
        },1000);}


    function closeDatabaseConnection() {
        if (databaseConnection) {
            databaseConnection.close();
            databaseConnection = null;
        }

        if(reconnectTimer){
            clearTimeout(reconnectTimer);
            reconnectTimer = null;
        }
        } 
        
    function reconnectToDatabase() {
        closeDatabaseConnection();
        connectDatabase();
    }
    return null;
}