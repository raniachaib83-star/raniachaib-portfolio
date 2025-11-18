const express = require('express');
const mysql = require('mysql2');                                                                                                                                                                                                       
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
// Pour servir les images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'css')));


// Autoriser les fichiers statiques dans le dossier 'uploads'
app.use('/uploads', express.static('uploads'));

// Configurer les CORS si nécessaire


// Connexion MySQL (avec pool pour éviter les erreurs de connexion)
const db =  mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234', // Mets ton mot de passe MySQL
    database: 'commerce_db'
});
// Vérifier la connexion
db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Erreur de connexion à MySQL:', err);
    } else {
        console.log('✅ Connecté à MySQL.');
        connection.release(); // Libère la connexion après test
    }
});
// Configurer Multer pour l'upload des images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Garde le nom original du fichier
    }
});

const upload = multer({ storage: storage });
// Route pour récupérer tous les commerces
app.get('/commerces', (req, res) => {
    const sql = `
        SELECT commerces.id, commerces.nom, commerces.latitude, commerces.longitude,commerces.id_user,
               categorie.nom AS nom_categorie, categorie.icone
        FROM commerces
        JOIN categorie ON commerces.id_categorie = categorie.id;
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Erreur lors de la récupération des commerces:", err);
            return res.status(500).json({ error: "Erreur de serveur" });
        }
        res.json(results);
    });
});
//supprimer par id user
app.delete('/commerces/:id', async (req, res) => {
    const { userId } = req.body; // Récupérer l'ID de l'utilisateur connecté
    const commerceId = req.params.id;

    if (!userId) {
        return res.status(401).json({ message: "Vous devez être connecté pour supprimer un commerce." });
    }

    try {
        // Vérifier si l'utilisateur est le propriétaire du commerce
        const [rows] = await db.promise().query(
            "SELECT id_user FROM commerces WHERE id = ?",
            [commerceId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Commerce introuvable." });
        }

        if (String(rows[0].id_user) !== String(userId)) {
            return res.status(403).json({ message: "Vous n'avez pas le droit de supprimer ce commerce." });
        }

        // Supprimer le commerce
        await db.promise().query("DELETE FROM commerces WHERE id = ?", [commerceId]);

        res.status(200).json({ message: "Commerce supprimé avec succès." });
    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

//chercher 
app.get('/commerces/filtrer', (req, res) => {
    let categorieRecherche = req.query.categorie || '';

    if (!categorieRecherche.trim()) {
        return res.status(400).json({ message: "Veuillez entrer une catégorie valide." });
    }

    const sql = `
        SELECT commerces.id, commerces.nom, commerces.latitude, commerces.longitude, 
               categorie.nom AS nom_categorie, categorie.icone 
        FROM commerces 
        JOIN categorie ON commerces.id_categorie = categorie.id
        WHERE LOWER(categorie.nom) LIKE LOWER(?)`;

    db.query(sql, [`%${categorieRecherche}%`], (err, results) => {
        if (err) {
            console.error('Erreur lors du filtrage des commerces:', err);
            return res.status(500).json({ message: 'Erreur serveur' });
        }
        res.json(results);
    });
});
//recuperer les categories
app.get('/categorie', (req, res) => {
    const sql = "SELECT DISTINCT nom FROM categorie"; // Récupérer toutes les catégories distinctes
    db.query(sql, (error, results) => {
        if (error) {
            console.error("Erreur lors de la récupération des catégories :", error);
            res.status(500).send("Erreur serveur");
        } else {
            res.json(results);
        }
    });
});

app.get('/categories', (req, res) => {
    db.query('SELECT id,nom FROM categorie', (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des catégories :', err);
            res.status(500).json({ error: 'Erreur serveur' });
        } else {
            res.json(results);
        }
    });
});



// Route pour ajouter un commerce
app.post('/commerces', async (req, res) => {
    const { nom, id_categorie, latitude, longitude, userId } = req.body;

    if (!userId) {
        return res.status(401).json({ message: "Vous devez être connecté pour ajouter un commerce." });
    }

    try {
        const [result] = await db.promise().query(
            "INSERT INTO commerces (nom, id_categorie, latitude, longitude, id_user) VALUES (?, ?, ?, ?, ?)",
            [nom, id_categorie, latitude, longitude, userId]
        );

        res.status(201).json({ message: "Commerce ajouté avec succès !", id: result.insertId });
    } catch (error) {
        console.error("Erreur d'ajout dans la BDD :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});


// Route pour récupérer les avis d'un commerce
app.get('/avis/:id', async (req, res) => {
    try {// Correction ici
        const commerceId = parseInt(req.params.id, 10);

        const [results] = await db.promise().query('SELECT * FROM avis WHERE commerce_id = ?', [commerceId]); // Suppression du callback
        res.json(results);
    } catch (err) {
        console.error("Erreur lors de la récupération des avis :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// Route pour ajouter un avis
app.post('/avis', async (req, res) => {
    const { commerceId, utilisateur, commentaire, note, userId } = req.body; // Changer id_user en userId

    if (!commentaire || !utilisateur || !note || !userId) { // Vérifier que userId est bien fourni
        return res.status(400).json({ message: "Données invalides" });
    }

    try {
        const [result] = await db.promise().query(
            "INSERT INTO avis (commerce_id, utilisateur, commentaire, note, id_user) VALUES (?, ?, ?, ?, ?)", 
            [commerceId, utilisateur, commentaire, note, userId] // Remplacer id_user par userId
        );
        res.status(201).json({ message: "Avis ajouté ", id: result.insertId });
    } catch (error) {
        console.error("❌ Erreur d'ajout dans la BDD:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

app.delete('/avis/:idAvis', async (req, res) => {
    const { idAvis } = req.params;
    const { userId } = req.body; // Récupérer l'ID utilisateur envoyé depuis le frontend

    if (!userId) {
        return res.status(401).json({ message: "Utilisateur non authentifié." });
    }

    try {
        // Vérifier que l'avis appartient bien à l'utilisateur
        const [avis] = await db.promise().query("SELECT id_user FROM avis WHERE id = ?", [idAvis]);

        if (avis.length === 0) {
            return res.status(404).json({ message: "Avis non trouvé." });
        }

        if (avis[0].id_user !== userId) {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer cet avis." });
        }

        // Supprimer l'avis
        await db.promise().query("DELETE FROM avis WHERE id = ?", [idAvis]);

        res.json({ message: "Avis supprimé avec succès." });
    } catch (error) {
        console.error("Erreur lors de la suppression de l'avis :", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
});


// 📌 Route POST pour ajouter une image
app.post('/images', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Aucune image envoyée" });
        }

        const { commerceId, userId } = req.body;  // Récupérer les données
        if (!commerceId || !userId) {
            return res.status(400).json({ message: "ID utilisateur ou commerce manquant" });
        }

        const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;

        // Insérer dans la base de données
        await db.promise().query("INSERT INTO images (commerce_id, url, id_user) VALUES (?, ?, ?)", 
            [commerceId, imageUrl, userId]);

        res.status(201).json({ message: "Image ajoutée avec succès!", url: imageUrl });
    } catch (err) {
        console.error("Erreur lors de l'ajout de l'image:", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});


// 📌 Route GET pour récupérer les images d'un commerce
app.get('/images/:commerceId', async (req, res) => {
    const commerceId = req.params.commerceId;
    try {
        const [images] = await db.promise().query('SELECT * FROM images WHERE commerce_id = ?', [commerceId]);

        if (images.length === 0) {
            return res.status(404).json({ error: "Aucune image trouvée pour ce commerce." });
        }

        res.json(images);
    } catch (error) {
        console.error("Erreur lors de la récupération des images :", error);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});
app.post('/images/:commerceId', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "Aucune image envoyée" });
    }

    const { commerceId } = req.params; // Récupérer commerceId depuis l'URL
    const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
    const id_user = req.body.userId; 

    try {
        await db.promise().query(
            "INSERT INTO images (commerce_id, url, id_user) VALUES (?, ?, ?)", 
            [commerceId, imageUrl, id_user]
        );

        res.status(201).json({ message: "Image ajoutée avec succès!", url: imageUrl });
    } catch (err) {
        console.error("Erreur lors de l'ajout de l'image:", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});
app.delete('/images/:idImage', async (req, res) => {
    const { idImage } = req.params;
    const idUser = req.body.userId; // Récupérer l'ID utilisateur de la requête

    if (!idUser) {
        return res.status(403).json({ message: "Utilisateur non authentifié !" });
    }

    try {
        // Vérifier si l'utilisateur est bien le propriétaire de l'image
        const [image] = await db.promise().query(
            "SELECT id_user FROM images WHERE id = ?", [idImage]
        );

        if (image.length === 0) {
            return res.status(404).json({ message: "Image non trouvée !" });
        }

        if (image[0].id_user !== idUser) {
            return res.status(403).json({ message: "Vous ne pouvez supprimer que vos propres images !" });
        }

        // Supprimer l'image si l'utilisateur est le propriétaire
        await db.promise().query("DELETE FROM images WHERE id = ?", [idImage]);

        res.json({ message: "Image supprimée avec succès !" });
    } catch (err) {
        console.error("Erreur lors de la suppression de l'image:", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

app.post("/auth/google", async (req, res) => {
    const { id, name, email } = req.body;

    if (!id || !email) {
        return res.status(400).json({ error: "Informations manquantes" });
    }

    // Vérifier si l'utilisateur existe déjà
    const [rows] = await db.promise().query("SELECT * FROM users WHERE id = ?", [id]);

    if (rows.length === 0) {
        // Si l'utilisateur n'existe pas, on l'insère
        await db.promise().query("INSERT INTO users (id, name, email) VALUES (?, ?, ?)", [id, name, email]);
    }

    res.json({ message: "Utilisateur enregistré" });
});
// Lancer le serveur
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
