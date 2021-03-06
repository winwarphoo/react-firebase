import { auth, db } from '../firebase';
import { useNavigate, Navigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { useAuthContext } from '../context/AuthContext';
import { useState, useEffect } from "react";
import { collection, getDocs, getDoc, doc, onSnapshot, addDoc, serverTimestamp, deleteDoc, where, query, updateDoc, orderBy, limit } from "firebase/firestore";

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
    const q = query(
      usersCollectionRef, 
      // where("admin", "==", true), 
      orderBy('name', 'desc'), 
      // limit(3)
    );
    // getDocs(usersCollectionRef).then((querySnapshot) => {
    //   setUsers(querySnapshot.docs.map((doc) => doc.data()))
    // });
    const unsub = onSnapshot(q, (querySnap) => {
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
  const handleSubmit = async (event) => {
    event.preventDefault();
    const {name, email} = event.target.elements;
    console.log(name.value,email.value);

    //　登録処理
    const usersCollectionRef = collection(db, "users");
    const documentRef = await addDoc(usersCollectionRef, { 
      name:name.value, 
      email: email.value ,
      timestamp: serverTimestamp(),
    });
    getDoc(documentRef).then((docSnap) =>
      console.log(documentRef.id, docSnap.data())
    ); 
  };

  const deleteUser = async (id) => {
    const userDocumentRef = doc(db, 'users', id);
    await deleteDoc(userDocumentRef);
  };

  const deleteUserByName = async (name) => {
    const usersCollectionRef = collection(db, "users");
    const q = query(usersCollectionRef, where("name", "==", name));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (document) => {
      const userDocumentRef = doc(db, "users", document.id);
      await deleteDoc(userDocumentRef);
    });
  };

  const changeAdmin = async (id, checked) => {
    const userDocumentRef = doc(db, 'users', id);
    await updateDoc(userDocumentRef, { admin: checked });
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
            <div key={user.id}>
              <span>{user.name}</span>
              <button onClick={() => deleteUser(user.id)}>削除</button>
              <button onClick={() => deleteUserByName(user.name)} style={{ color: "red" }}>削除</button>
              {!user.admin && (
                <button onClick={() => changeAdmin(user.id)}>admin</button>
              )}
              <input 
                type="checkbox" 
                name='admin' 
                onChange={(event) => changeAdmin(user.id, event.target.checked)} 
                checked={user.admin} />
            </div>
          ))}
          <hr />
          <form onSubmit={handleSubmit}>
            <div>
              <label>名前</label>
              <input name="name" type="text" placeholder="名前" />
            </div>
            <div>
              <label>メールアドレス</label>
              <input name="email" type="email" placeholder="メールアドレス" />
            </div>
            <div>
              <button>登録</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
};

export default Home;