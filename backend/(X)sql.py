import mysql.connector;
from mysql.connector import pooling;


class Owner:
    mySqlConnect = None # Sql switch
     
    @staticmethod
    def init_DB_connection():
        Owner.mySqlConnect = mysql.connector.connect(
            host='127.0.0.1',
            user='System_Manager',
            password='1234',
            database='Pet_Adoption_DB'
        )
    @staticmethod
    def close_DB_connection():
        """
        Closes the database connection if it is currently connected.

        This function checks if the database connection is currently open by calling the `is_connected()` method on the `mySqlConnect` attribute of the `Owner` class. If the connection is open, it calls the `close()` method on the `mySqlConnect` attribute to close the connection.

        Parameters:
            None

        Returns:
            None
        """
        Owner.mySqlConnect.close()
    
    def Get_Owner_All(): 
        """
        Retrieves all the owner's data from the database.

        This function connects to the database, creates a cursor, and executes an SQL SELECT statement to retrieve all the owner's data.
        The function returns the owner's data as a list of dictionaries. Each dictionary represents a row in the database table and contains the column names as keys and the corresponding values as values.

        Returns:
            list: A list of dictionaries representing the owner's data. Each dictionary contains the column names as keys and the corresponding values as values.
        """
        mydb = Owner.mySqlConnect

        cursor = mydb.cursor()
        cursor.execute('SELECT * FROM Owner')
        data = cursor.fetchall()
        result = [dict((cursor.description[i][0], value) for i, value in enumerate(row)) for row in data]
        # ↑ is equal to ↓
        # result = []
        # for d in range(len(data)):
        #     result.append(dict())
        #     print(data[d])
        #     for i, value in enumerate(data[d]):
        #         result[d][cursor.description[i][0]] = value
    
        print(result)
        cursor.close()
        
        return result
    
    def Get_Owner_by_name(name: str) -> str:
        """
        Retrieves the owner's data from the database based on their name.

        Args:
            name (str): The name of the owner.

        Returns:
            str: The owner's data as a string. Returns None if no matching record is found.

        This function connects to the database, creates a cursor, and executes an SQL SELECT statement to retrieve the owner's data based on their name.
        The function returns the owner's data as a string. If no matching record is found, it returns None.
        """

        mydb = Owner.mySqlConnect
        cursor = mydb.cursor()
        cursor.execute('SELECT * FROM Owner WHERE name = %s', (name,))
        data = cursor.fetchone()
        cursor.close()
        return data
    
    def save_Owner_data(name:str,password:str,gender:str)->None:
        """
        Save owner data to the database.

        Args:
            name (str): The name of the owner.
            password (str): The password of the owner.
            gender (str): The gender of the owner.

        Returns:
            None

        This function connects to the database, creates a cursor, and executes an SQL INSERT statement to save the owner's data.
        The data includes the name, gender, and password.
        After executing the SQL statement, the changes are committed to the database.
        Finally, the cursor is closed.

        Note:
            The function assumes that the `mySqlConnect` attribute is defined in the `Owner` class and represents the connection to the database.
        """
        mydb = Owner.mySqlConnect
        cursor = mydb.cursor()
        cursor.execute('INSERT INTO Owner(name,gender,password) VALUES(%s,%s,%s)',(name,gender,password))
        mydb.commit()
        cursor.close()

    def login_Owner(name:str,password:str) ->list:
        """
        Authenticates the owner by checking if the provided name and password match any records in the Owner table.

        Parameters:
            name (str): The name of the owner.
            password (str): The password of the owner.

        Returns:
            tuple or None: If a matching record is found, returns a tuple containing the owner's data. Otherwise, returns None.
        """
        mydb = Owner.mySqlConnect
        cursor =mydb.cursor()
        cursor.execute('SELECT * FROM Owner WHERE name = %s AND password = %s',(name,password))
        data = cursor.fetchone()
        cursor.close()
        return data
    
    def Get_Owner_by_id(oId:int):
        mydb = Owner.mySqlConnect
        cursor =mydb.cursor()
        cursor.execute('SELECT name FROM Owner WHERE `id` = %s', (oId,))
        data = cursor.fetchone()
        cursor.close()
        return data

class Pet:
    mySqlConnect = None

    @staticmethod
    def init_DB_connection():
        Pet.mySqlConnect = mysql.connector.connect(
            host='127.0.0.1',
            user='System_Manager',
            password='1234',
            database='Pet_Adoption_DB'
        )

    @staticmethod
    def close_DB_connection():
        """
        Closes the database connection if it is currently connected.

        This function checks if the database connection is currently open by calling the `is_connected()` method on the `mySqlConnect` attribute of the `Owner` class. If the connection is open, it calls the `close()` method on the `mySqlConnect` attribute to close the connection.

        Parameters:
            None

        Returns:
            None
        """
        Pet.mySqlConnect.close()


    def save_Pet_data(name:str,age:str,variety:str,info:str,image_path:str) -> bool:
        mydb = Pet.mySqlConnect
        cursor = mydb.cursor()
        cursor.execute('INSERT INTO `Pet`(`name`,`age`,`variety`,`information`,`petImage`) VALUES(%s,%s,%s,%s,%s)',(name,age,variety,info,image_path))
        mydb.commit()
        cursor.close()
        return True
    
    def Get_Pet_data():
        mydb = Pet.mySqlConnect
        cursor = mydb.cursor()
        cursor.execute('SELECT * FROM `Pet`')
        data = cursor.fetchall()
        result = [dict((cursor.description[i][0], value) for i, value in enumerate(row)) for row in data]
        cursor.close()
        return result
    
    def Update_Owner(pId:str,userId:str):
        mydb = Pet.mySqlConnect
        cursor = mydb.cursor()
        cursor.execute('UPDATE `Pet` SET `OwnerId` = %s WHERE `pId` = %s',(userId,pId))
        mydb.commit()
        cursor.close()
        mydb.close()
        return True
    

    def Get_User_Pet(ownerId:str):
        mydb = Pet.mySqlConnect
        cursor = mydb.cursor()
        cursor.execute('SELECT * FROM `Pet` WHERE `OwnerId` = %s', (ownerId,))
        data = cursor.fetchall()
        result = [dict((cursor.description[i][0], value) for i, value in enumerate(row)) for row in data]
        cursor.close()
        return result