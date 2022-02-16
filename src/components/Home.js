import { auth, db } from '../firebase';
import { useNavigate, Navigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { useAuthContext } from '../context/AuthContext';
import { useState, useEffect } from "react";
import { collection, getDocs, getDoc, doc, onSnapshot } from "firebase/firestore";

const Home = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    signOut(auth);
    navigate('/login');
  };
  const { user } = useAuthContext();

  const [users, setUsers] = useState([]);
  useEffect(() => {
    const usersCollectionRef = collection(db, 'users');
    // getDocs(usersCollectionRef).then((querySnapshot) => {
    //   setUsers(querySnapshot.docs.map((doc) => doc.data()))
    // });
    const unsub = onSnapshot(usersCollectionRef, (querySnap) => {
      setUsers(querySnap.docs.map((doc) => ({
        ...doc.data(), id: doc.id})));
    });
    return unsub;
  }, []);

  const dbTest = () => {
    const userDocumentRef = doc(db, 'users', 'JAJ0FGKqIuMQXCM2Ivzq');
    getDoc(userDocumentRef).then((docSnap) =>{
      if (docSnap.exists()) {
        console.log("exists", docSnap.data());
      } else {
        console.log("No Such documents");
      }
    });
  };
  
  
  if (!user) {
    return <Navigate to="/login"/>
  } else {
    return (
      <div>
        <h1>ホームページ</h1>
        <div>
          <button onClick={handleLogout}>ログアウト</button>
        </div>
        <div>
          <button onClick={dbTest}>TEST</button>
          {users.map((user) => (
            <div key={user.id}>{user.name}</div>
          ))}
        </div>
      </div>
    );
  }
};

export default Home;