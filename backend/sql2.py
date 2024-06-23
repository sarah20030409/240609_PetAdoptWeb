import mysql.connector;
from mysql.connector import pooling;


class Database:
    mysqlConnect = None 

    @staticmethod
    def init_connection_pool(host,user,password,database,pool_name="my_pool",pool_size=15,connection_timeout=1):
        Database.mysqlConnect = mysql.connector.pooling.MySQLConnectionPool(
            pool_name=pool_name,
            pool_reset_session=True,
            # connection_timeout = connection_timeout,
            pool_size=pool_size,
            host=host,
            user=user,
            password=password,
            database=database
        )

    @staticmethod
    def get_connection():
        if not Database.mysqlConnect:
            raise Exception("Connection pool is not initialized. Call init_connection_pool first.")
        return Database.mysqlConnect.get_connection()
    
    @staticmethod
    def execute_query(query,params=None, fetchOneData=False):
        mydb =Database.get_connection()
        cursor = mydb.cursor()

        try:
            cursor.execute(query,params)

            if fetchOneData:
                data = cursor.fetchone()
                if data:
                    result = {cursor.description[i][0]: value for i, value in enumerate(data)}
                else:
                    result = None

            else:
                data = cursor.fetchall()
                result = [dict((cursor.description[i][0], value) for i, value in enumerate(row)) for row in data]
                
        finally:
            cursor.close()
            mydb.close()
            print("execute_query CLOSE!!")

        return result
    
    @staticmethod
    def execute_commit(query,params=None):
        mydb =Database.get_connection()
        cursor = mydb.cursor()

        try:
            cursor.execute(query,params)
            mydb.commit()
        finally:
            cursor.close()
            mydb.close()
            print("execute_commit CLOSE!!")



class Owner(Database):
    def Get_Owner_All(): 
        """
        Retrieves all the owner's data from the database.

        This function connects to the database, creates a cursor, and executes an SQL SELECT statement to retrieve all the owner's data.
        The function returns the owner's data as a list of dictionaries. Each dictionary represents a row in the database table and contains the column names as keys and the corresponding values as values.

        Returns:
            list: A list of dictionaries representing the owner's data. Each dictionary contains the column names as keys and the corresponding values as values.
        
        # result = [dict((cursor.description[i][0], value) for i, value in enumerate(row)) for row in data]
        # ↑ is equal to ↓
        # result = []
        # for d in range(len(data)):
        #     result.append(dict())
        #     print(data[d])
        #     for i, value in enumerate(data[d]):
        #         result[d][cursor.description[i][0]] = value
        """
        result = Owner.execute_query('SELECT * FROM Owner')
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
        qurey = 'SELECT * FROM Owner WHERE name = %s'
        params = (name, )
        result = Owner.execute_query(qurey, params, fetchOneData=True) # fetchOneData=True?????

        return result
    
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
        qurey = 'INSERT INTO Owner(name,gender,password) VALUES(%s,%s,%s)'
        params = (name,gender,password)
        Owner.execute_commit(qurey, params)

    def login_Owner(name:str,password:str) ->list:
        """
        Authenticates the owner by checking if the provided name and password match any records in the Owner table.

        Parameters:
            name (str): The name of the owner.
            password (str): The password of the owner.

        Returns:
            tuple or None: If a matching record is found, returns a tuple containing the owner's data. Otherwise, returns None.
        """
        qurey = 'SELECT * FROM Owner WHERE name = %s AND password = %s'
        params = (name, password)
        result = Owner.execute_query(qurey, params, fetchOneData=True)

        return result
    
    def Get_Owner_by_id(pId:int):
        query = 'SELECT Owner.name FROM Pet JOIN Owner ON Pet.OwnerId = Owner.oId WHERE Pet.pId = %s'
        params = (pId, )
        result = Owner.execute_query(query, params, fetchOneData=True)

        if result is None:
            return None
        else:
            return result



class Pet(Database):
    def save_Pet_data(name:str,age:str,variety:str,info:str,image_path:str) -> bool:
        query = 'INSERT INTO `Pet`(`name`,`age`,`variety`,`information`,`petImage`) VALUES(%s,%s,%s,%s,%s)'
        params = (name,age,variety,info,image_path)
        result = Pet.execute_commit(query, params)
        result

        return True
    
    def Get_Pet_data():
        query = 'SELECT * FROM `Pet`'
        result = Pet.execute_query(query)

        return result
    
    def Update_Owner(pId:str,userId:str):
        query = 'UPDATE `Pet` SET `OwnerId` = %s WHERE `pId` = %s'
        params = (userId,pId)
        result = Pet.execute_commit(query, params)
        result

        return True
    
    def Get_User_Pet(ownerId:str):
        query = 'SELECT * FROM `Pet` WHERE `OwnerId` = %s'
        params = (ownerId, )
        result = Pet.execute_query(query, params)

        return result
    
    def Get_Data_by_id(pId:int):
        query = 'SELECT * FROM `Pet` WHERE `pId` = %s'
        params = (pId, )
        result = Pet.execute_query(query, params)

        return result


class Comments(Database):
    def save_comment_data(oId:int,pId:int,comment:str):
        query = 'INSERT INTO `Comments`(`oId`,`pId`,`comments`) VALUES(%s,%s,%s)'
        params = (oId,pId,comment)
        result =Comments.execute_commit(query, params)
        result

        return True

    def get_comment_data(pId:int):
        query = 'SELECT `Owner`.`name` , `Comments`.`comments` FROM `Owner` JOIN `Comments` ON `Owner`.`oId` = `Comments`.`oId` WHERE `Comments`.`pId` = %s'
        params = (pId, )
        result = Comments.execute_query(query, params)

        return result