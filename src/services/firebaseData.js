// Firebase Data Service for TraceHerbs
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  addDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast } from 'react-hot-toast';

class FirebaseDataService {
  
  // User Profile Operations
  static async createUserProfile(userId, profileData) {
    try {
      const profileRef = doc(db, 'profiles', userId);
      const dataToSave = {
        ...profileData,
        id: userId,
        userId: userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(profileRef, dataToSave);
      
      console.log('✅ User profile created');
      return { success: true, data: dataToSave };
      
    } catch (error) {
      console.error('❌ Create profile error:', error);
      return { success: false, error: error.message };
    }
  }
  
  static async getUserProfile(userId) {
    try {
      const profileDoc = await getDoc(doc(db, 'profiles', userId));
      
      if (profileDoc.exists()) {
        return { success: true, data: profileDoc.data() };
      } else {
        return { success: false, error: 'Profile not found' };
      }
      
    } catch (error) {
      console.error('❌ Get profile error:', error);
      return { success: false, error: error.message };
    }
  }
  
  static async updateUserProfile(userId, updateData) {
    try {
      const profileRef = doc(db, 'profiles', userId);
      const dataToUpdate = {
        ...updateData,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(profileRef, dataToUpdate);
      
      console.log('✅ Profile updated');
      toast.success('Profile updated successfully');
      return { success: true };
      
    } catch (error) {
      console.error('❌ Update profile error:', error);
      toast.error('Failed to update profile');
      return { success: false, error: error.message };
    }
  }
  
  // Farmer Profile Operations
  static async createFarmerProfile(userId, farmerData) {
    try {
      const farmerRef = doc(db, 'farmerProfiles', userId);
      const dataToSave = {
        ...farmerData,
        userId: userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(farmerRef, dataToSave);
      
      console.log('✅ Farmer profile created');
      return { success: true, data: dataToSave };
      
    } catch (error) {
      console.error('❌ Create farmer profile error:', error);
      return { success: false, error: error.message };
    }
  }
  
  static async getFarmerProfile(userId) {
    try {
      const farmerDoc = await getDoc(doc(db, 'farmerProfiles', userId));
      
      if (farmerDoc.exists()) {
        return { success: true, data: farmerDoc.data() };
      } else {
        return { success: false, error: 'Farmer profile not found' };
      }
      
    } catch (error) {
      console.error('❌ Get farmer profile error:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Batch Operations
  static async createBatch(batchData) {
    try {
      const batchRef = collection(db, 'batches');
      const dataToSave = {
        ...batchData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(batchRef, dataToSave);
      
      console.log('✅ Batch created with ID:', docRef.id);
      toast.success('Batch created successfully');
      
      return { success: true, id: docRef.id, data: dataToSave };
      
    } catch (error) {
      console.error('❌ Create batch error:', error);
      toast.error('Failed to create batch');
      return { success: false, error: error.message };
    }
  }
  
  static async getBatchesByFarmer(farmerId) {
    try {
      const q = query(
        collection(db, 'batches'),
        where('farmerId', '==', farmerId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const batches = [];
      
      querySnapshot.forEach((doc) => {
        batches.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return { success: true, data: batches };
      
    } catch (error) {
      console.error('❌ Get farmer batches error:', error);
      return { success: false, error: error.message };
    }
  }
  
  static async updateBatch(batchId, updateData) {
    try {
      const batchRef = doc(db, 'batches', batchId);
      const dataToUpdate = {
        ...updateData,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(batchRef, dataToUpdate);
      
      console.log('✅ Batch updated');
      toast.success('Batch updated successfully');
      return { success: true };
      
    } catch (error) {
      console.error('❌ Update batch error:', error);
      toast.error('Failed to update batch');
      return { success: false, error: error.message };
    }
  }
  
  // QR Code Operations
  static async createQRCode(qrData) {
    try {
      const qrRef = collection(db, 'qrCodes');
      const dataToSave = {
        ...qrData,
        isActive: true,
        scanCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(qrRef, dataToSave);
      
      console.log('✅ QR Code created with ID:', docRef.id);
      toast.success('QR Code generated successfully');
      
      return { success: true, id: docRef.id, data: dataToSave };
      
    } catch (error) {
      console.error('❌ Create QR code error:', error);
      toast.error('Failed to generate QR code');
      return { success: false, error: error.message };
    }
  }
  
  static async getQRCodeByCode(qrCodeId) {
    try {
      const q = query(
        collection(db, 'qrCodes'),
        where('qrCodeId', '==', qrCodeId),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { 
          success: true, 
          data: {
            id: doc.id,
            ...doc.data()
          }
        };
      } else {
        return { success: false, error: 'QR Code not found' };
      }
      
    } catch (error) {
      console.error('❌ Get QR code error:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Notification Operations
  static async createNotification(notificationData) {
    try {
      const notifRef = collection(db, 'notifications');
      const dataToSave = {
        ...notificationData,
        isRead: false,
        createdAt: serverTimestamp()
      };
      
      const docRef = await addDoc(notifRef, dataToSave);
      
      console.log('✅ Notification created');
      return { success: true, id: docRef.id };
      
    } catch (error) {
      console.error('❌ Create notification error:', error);
      return { success: false, error: error.message };
    }
  }
  
  static async getUserNotifications(userId) {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('recipientId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      
      const querySnapshot = await getDocs(q);
      const notifications = [];
      
      querySnapshot.forEach((doc) => {
        notifications.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return { success: true, data: notifications };
      
    } catch (error) {
      console.error('❌ Get notifications error:', error);
      return { success: false, error: error.message };
    }
  }
  
  // General CRUD Operations
  static async getCollection(collectionName, conditions = []) {
    try {
      let q = collection(db, collectionName);
      
      if (conditions.length > 0) {
        q = query(q, ...conditions);
      }
      
      const querySnapshot = await getDocs(q);
      const data = [];
      
      querySnapshot.forEach((doc) => {
        data.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return { success: true, data };
      
    } catch (error) {
      console.error(`❌ Get ${collectionName} error:`, error);
      return { success: false, error: error.message };
    }
  }
  
  static async getDocument(collectionName, docId) {
    try {
      const docSnap = await getDoc(doc(db, collectionName, docId));
      
      if (docSnap.exists()) {
        return { 
          success: true, 
          data: {
            id: docSnap.id,
            ...docSnap.data()
          }
        };
      } else {
        return { success: false, error: 'Document not found' };
      }
      
    } catch (error) {
      console.error(`❌ Get ${collectionName} document error:`, error);
      return { success: false, error: error.message };
    }
  }
  
  static async updateDocument(collectionName, docId, updateData) {
    try {
      const docRef = doc(db, collectionName, docId);
      const dataToUpdate = {
        ...updateData,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(docRef, dataToUpdate);
      
      console.log(`✅ ${collectionName} document updated`);
      return { success: true };
      
    } catch (error) {
      console.error(`❌ Update ${collectionName} document error:`, error);
      return { success: false, error: error.message };
    }
  }
  
  static async deleteDocument(collectionName, docId) {
    try {
      await deleteDoc(doc(db, collectionName, docId));
      
      console.log(`✅ ${collectionName} document deleted`);
      toast.success('Document deleted successfully');
      return { success: true };
      
    } catch (error) {
      console.error(`❌ Delete ${collectionName} document error:`, error);
      toast.error('Failed to delete document');
      return { success: false, error: error.message };
    }
  }
}

export default FirebaseDataService;