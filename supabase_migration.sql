
-- Script de migration vers Supabase PostgreSQL
-- Généré automatiquement depuis SQLite

-- Activer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Supprimer les tables existantes (si elles existent)
DROP TABLE IF EXISTS "ArticleGallery" CASCADE;
DROP TABLE IF EXISTS "EventGallery" CASCADE;
DROP TABLE IF EXISTS "Article" CASCADE;
DROP TABLE IF EXISTS "Event" CASCADE;
DROP TABLE IF EXISTS "Document" CASCADE;
DROP TABLE IF EXISTS "ContactMessage" CASCADE;
DROP TABLE IF EXISTS "VisaApplication" CASCADE;
DROP TABLE IF EXISTS "Announcement" CASCADE;
DROP TABLE IF EXISTS "Category" CASCADE;
DROP TABLE IF EXISTS "Admin" CASCADE;

-- Créer les types ENUM
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'EDITOR');
CREATE TYPE "DocumentCategory" AS ENUM ('VISA_FORMS', 'LEGAL_DOCUMENTS', 'NEWS', 'ANNOUNCEMENTS', 'CULTURAL', 'ECONOMIC', 'POLITICAL');
CREATE TYPE "VisaStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'PROCESSING');

-- PRAGMA foreign_keys=OFF;
-- BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "admins" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'EDITOR',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT NOW(),
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO admins VALUES('cmfs521ju0000nrbswqlx0lwq','admin@ambassade-mali-libye.ml','$2b$12$IE2rNdLtlV7Wmy02dfIbTe0HTe8jhMUB3Dj.ZmWvBb7gk/lEKG0CG','Administrateur Principal','SUPER_ADMIN',1,1758364891483,1758364891483);
INSERT INTO admins VALUES('cmfsw0irl0000nrhlrffbhxcb','admin@ambassade-mali-libye.com','$2b$10$4GI0atuYEwaah6f.krupQeOd1d6gOP9C.BtCYyzI2IDXSR0h7xm7W','Administrateur','SUPER_ADMIN',1,1758410170113,1758410170113);
CREATE TABLE IF NOT EXISTS "documents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "titleAr" TEXT,
    "description" TEXT,
    "descriptionAr" TEXT,
    "fileUrl" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "authorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT NOW(),
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "documents_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "admins" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO documents VALUES('cmfszi2c30003nrsu3rrtm9hi','BOOKLET 1 LE MALI VF',NULL,NULL,NULL,'/uploads/documents/1758416027436-u22r22ncvos.pdf','BOOKLET 1 LE MALI VF.pdf',6876190,'application/pdf','LEGAL_DOCUMENTS',1,'cmfs521ju0000nrbswqlx0lwq',1758416027475,1758416027475);
INSERT INTO documents VALUES('cmfszi2dk0005nrsua9le8czd','Forum de l''OCI sur l''investissement à Bamako',NULL,NULL,NULL,'/uploads/documents/1758416027479-w0pkd42qru.pdf','Forum de l''OCI sur l''investissement à Bamako.pdf',4510214,'application/pdf','LEGAL_DOCUMENTS',1,'cmfs521ju0000nrbswqlx0lwq',1758416027529,1758416027529);
INSERT INTO documents VALUES('cmfszi2ds0007nrsu54qv9ro3','HYMNE AES _ Sahel Benkan',NULL,NULL,NULL,'/uploads/documents/1758416027531-mtb5g42rpkn.pdf','HYMNE AES _ Sahel Benkan.pdf',295801,'application/pdf','LEGAL_DOCUMENTS',1,'cmfs521ju0000nrbswqlx0lwq',1758416027536,1758416027536);
INSERT INTO documents VALUES('cmfszi2ep0009nrsu4qd7kxsr','S.E ABDOULAYE DIOP À LOMÉ - UNE VISION AFFIRMÉE POUR UNE AFRIQUE SOUVERAINE ET STRATÉGIQUEMENT AUTONOME',NULL,NULL,NULL,'/uploads/documents/1758416027539-7v6z8tlv3jf.pdf','S.E ABDOULAYE DIOP À LOMÉ - UNE VISION AFFIRMÉE POUR UNE AFRIQUE SOUVERAINE ET STRATÉGIQUEMENT AUTONOME.pdf',6575729,'application/pdf','LEGAL_DOCUMENTS',1,'cmfs521ju0000nrbswqlx0lwq',1758416027569,1758416027569);
INSERT INTO documents VALUES('cmfszi2fk000bnrsueyr8v2xe','Serie Booklet 2 Agro-Pastorale',NULL,NULL,NULL,'/uploads/documents/1758416027570-jl1eedeud7.pdf','Serie Booklet 2 Agro-Pastorale.pdf',7924429,'application/pdf','LEGAL_DOCUMENTS',1,'cmfs521ju0000nrbswqlx0lwq',1758416027600,1758416027600);
INSERT INTO documents VALUES('cmfszkljy000dnrsudknoh5ld','Les opportunités d''investissement au Mali',NULL,NULL,NULL,'/uploads/documents/1758416145669-c8yhel124kj.pdf','Les opportunités d''investissement au Mali.pdf',6197040,'application/pdf','LEGAL_DOCUMENTS',1,'cmfs521ju0000nrbswqlx0lwq',1758416145694,1758416145694);
INSERT INTO documents VALUES('cmfszkll3000fnrsu93eprckz','Serie Booklet 2 Agro-Pastorale',NULL,NULL,NULL,'/uploads/documents/1758416145700-lrs6gs1mv7s.pdf','Serie Booklet 2 Agro-Pastorale.pdf',7924429,'application/pdf','LEGAL_DOCUMENTS',1,'cmfs521ju0000nrbswqlx0lwq',1758416145735,1758416145735);
INSERT INTO documents VALUES('cmfszklmq000hnrsura4uw3sf','TOGO - LE MINISTRE MALIEN DES AFFAIRES ÉTRANGÈRES S.E ABDOULAYE DIOP PLAIDE POUR UNE AUTONOMIE STRATÉGIQUE DE L’AFRIQUE ',NULL,NULL,NULL,'/uploads/documents/1758416145737-pfi5ww2vm6e.pdf','TOGO - LE MINISTRE MALIEN DES AFFAIRES ÉTRANGÈRES S.E ABDOULAYE DIOP PLAIDE POUR UNE AUTONOMIE STRATÉGIQUE DE L’AFRIQUE .pdf',5836098,'application/pdf','LEGAL_DOCUMENTS',1,'cmfs521ju0000nrbswqlx0lwq',1758416145794,1758416145794);
CREATE TABLE IF NOT EXISTS "visa_applications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "passportNumber" TEXT NOT NULL,
    "visaType" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "entryDate" DATETIME NOT NULL,
    "exitDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "documents" TEXT,
    "notes" TEXT,
    "processedBy" TEXT,
    "processedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT NOW(),
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "visa_applications_processedBy_fkey" FOREIGN KEY ("processedBy") REFERENCES "admins" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "contact_messages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "repliedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT NOW()
);
INSERT INTO contact_messages VALUES('cmfs8ivx60000nrgt3lazz44a','Test User','test@example.com','+33 1 23 45 67 89','Test intégration','Message de test pour valider l''intégration',0,NULL,1758370716179);
INSERT INTO contact_messages VALUES('cmfs93c3e0001nrgt8btbh4c8','Test User','test@example.com','+33 1 23 45 67 89','Test d''intégration','Ceci est un message de test pour vérifier l''intégration.',0,NULL,1758371670265);
CREATE TABLE IF NOT EXISTS "announcements" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "titleAr" TEXT,
    "content" TEXT NOT NULL,
    "contentAr" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startDate" DATETIME NOT NULL DEFAULT NOW(),
    "endDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT NOW(),
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO announcements VALUES('cmfs521kj0005nrbsfa5yutjf','Nouveaux horaires de l''Ambassade','أوقات عمل جديدة للسفارة','L''Ambassade sera ouverte du dimanche au jeudi de 8h00 à 16h00. Les services consulaires sont disponibles sur rendez-vous.','ستكون السفارة مفتوحة من الأحد إلى الخميس من الساعة 8:00 إلى 16:00. الخدمات القنصلية متاحة بموعد مسبق.','HIGH',1,1758364891506,1760956891506,1758364891507,1758364891507);
CREATE TABLE IF NOT EXISTS "article_gallery" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "articleId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "altText" TEXT,
    "caption" TEXT,
    "captionAr" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT NOW(),
    CONSTRAINT "article_gallery_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO article_gallery VALUES('cmftrshz8001hnrh16qbyffo4','cmfsru31z0003nr643tz4f3xn','/uploads/images/1758463543475-bxz4lc2oxm5.jpeg','WhatsApp Image 2025-09-15 at 19.08.42 (1)','WhatsApp Image 2025-09-15 at 19.08.42 (1)',NULL,0,1758463543556);
INSERT INTO article_gallery VALUES('cmftrsi81001jnrh14xi9wv8a','cmfsru31z0003nr643tz4f3xn','/uploads/images/1758463543633-cby74z5gbk.jpeg','WhatsApp Image 2025-09-15 at 19.08.42','WhatsApp Image 2025-09-15 at 19.08.42',NULL,0,1758463543874);
INSERT INTO article_gallery VALUES('cmftrsici001lnrh1exz0nlt7','cmfsru31z0003nr643tz4f3xn','/uploads/images/1758463543979-kx3j55rehno.jpeg','WhatsApp Image 2025-09-15 at 19.08.43 (1)','WhatsApp Image 2025-09-15 at 19.08.43 (1)',NULL,0,1758463544035);
INSERT INTO article_gallery VALUES('cmftrsiez001nnrh1kjya9epl','cmfsru31z0003nr643tz4f3xn','/uploads/images/1758463544086-d140mzoa1rd.jpeg','WhatsApp Image 2025-09-15 at 19.08.43 (2)','WhatsApp Image 2025-09-15 at 19.08.43 (2)',NULL,0,1758463544123);
INSERT INTO article_gallery VALUES('cmftrsih2001pnrh16w3peo38','cmfsru31z0003nr643tz4f3xn','/uploads/images/1758463544157-ngvcnowlyo.jpeg','WhatsApp Image 2025-09-15 at 19.08.43','WhatsApp Image 2025-09-15 at 19.08.43',NULL,0,1758463544199);
INSERT INTO article_gallery VALUES('cmftrsijk001rnrh1k8cu021q','cmfsru31z0003nr643tz4f3xn','/uploads/images/1758463544237-h5nycxmfihl.jpeg','WhatsApp Image 2025-09-15 at 19.08.44 (1)','WhatsApp Image 2025-09-15 at 19.08.44 (1)',NULL,0,1758463544288);
INSERT INTO article_gallery VALUES('cmftrsilr001tnrh1zi5t5y5z','cmfsru31z0003nr643tz4f3xn','/uploads/images/1758463544329-9v3d65tpbht.jpeg','WhatsApp Image 2025-09-15 at 19.08.44 (2)','WhatsApp Image 2025-09-15 at 19.08.44 (2)',NULL,0,1758463544367);
INSERT INTO article_gallery VALUES('cmftrsipi001vnrh1g04b2ung','cmfsru31z0003nr643tz4f3xn','/uploads/images/1758463544451-7o9s8qir6sl.jpeg','WhatsApp Image 2025-09-15 at 19.08.44','WhatsApp Image 2025-09-15 at 19.08.44',NULL,0,1758463544502);
INSERT INTO article_gallery VALUES('cmftrsirf001xnrh1t3j9soac','cmfsru31z0003nr643tz4f3xn','/uploads/images/1758463544537-kgb49cvfce.jpeg','WhatsApp Image 2025-09-15 at 19.08.45 (1)','WhatsApp Image 2025-09-15 at 19.08.45 (1)',NULL,0,1758463544571);
INSERT INTO article_gallery VALUES('cmftrsit8001znrh1gpykjpnt','cmfsru31z0003nr643tz4f3xn','/uploads/images/1758463544603-zkyda1e79xb.jpeg','WhatsApp Image 2025-09-15 at 19.08.45 (2)','WhatsApp Image 2025-09-15 at 19.08.45 (2)',NULL,0,1758463544637);
INSERT INTO article_gallery VALUES('cmftrsiv40021nrh1jrph22yt','cmfsru31z0003nr643tz4f3xn','/uploads/images/1758463544671-l53px6m71uf.jpeg','WhatsApp Image 2025-09-15 at 19.08.45 (3)','WhatsApp Image 2025-09-15 at 19.08.45 (3)',NULL,0,1758463544705);
INSERT INTO article_gallery VALUES('cmftrsix20023nrh188r60ctm','cmfsru31z0003nr643tz4f3xn','/uploads/images/1758463544737-t7mcpo1q1tn.jpeg','WhatsApp Image 2025-09-15 at 19.08.45','WhatsApp Image 2025-09-15 at 19.08.45',NULL,0,1758463544774);
INSERT INTO article_gallery VALUES('cmftrsiyy0025nrh11rruwyvy','cmfsru31z0003nr643tz4f3xn','/uploads/images/1758463544806-t69lx7q2evc.jpeg','WhatsApp Image 2025-09-15 at 19.08.46 (1)','WhatsApp Image 2025-09-15 at 19.08.46 (1)',NULL,0,1758463544843);
INSERT INTO article_gallery VALUES('cmftrsj1w0027nrh14qq014y7','cmfsru31z0003nr643tz4f3xn','/uploads/images/1758463544882-v7hj0729fwh.jpeg','WhatsApp Image 2025-09-15 at 19.08.46 (2)','WhatsApp Image 2025-09-15 at 19.08.46 (2)',NULL,0,1758463544949);
INSERT INTO article_gallery VALUES('cmftrsj4x0029nrh1l1ju5dga','cmfsru31z0003nr643tz4f3xn','/uploads/images/1758463544989-wpn6l9wdv0n.jpeg','WhatsApp Image 2025-09-15 at 19.08.46','WhatsApp Image 2025-09-15 at 19.08.46',NULL,0,1758463545057);
INSERT INTO article_gallery VALUES('cmftrsj8o002bnrh1c5jd25g7','cmfsru31z0003nr643tz4f3xn','/uploads/images/1758463545127-iihk60dd7sd.jpeg','WhatsApp Image 2025-09-15 at 19.08.47 (1)','WhatsApp Image 2025-09-15 at 19.08.47 (1)',NULL,0,1758463545193);
INSERT INTO article_gallery VALUES('cmftrsjd5002dnrh1wb4aekg5','cmfsru31z0003nr643tz4f3xn','/uploads/images/1758463545253-px2lv3baztk.jpeg','WhatsApp Image 2025-09-15 at 19.08.47 (2)','WhatsApp Image 2025-09-15 at 19.08.47 (2)',NULL,0,1758463545354);
INSERT INTO article_gallery VALUES('cmftrsjib002fnrh1vahmc4ig','cmfsru31z0003nr643tz4f3xn','/uploads/images/1758463545484-5avwuiukwkk.jpeg','WhatsApp Image 2025-09-15 at 19.08.47','WhatsApp Image 2025-09-15 at 19.08.47',NULL,0,1758463545540);
INSERT INTO article_gallery VALUES('cmftrsjlu002hnrh1i7kkcgt9','cmfsru31z0003nr643tz4f3xn','/uploads/images/1758463545590-k0cxzh2upi.jpeg','WhatsApp Image 2025-09-15 at 19.08.48 (1)','WhatsApp Image 2025-09-15 at 19.08.48 (1)',NULL,0,1758463545666);
INSERT INTO article_gallery VALUES('cmftrsjol002jnrh1aaop52w5','cmfsru31z0003nr643tz4f3xn','/uploads/images/1758463545716-olgipcurczg.jpeg','WhatsApp Image 2025-09-15 at 19.08.48 (2)','WhatsApp Image 2025-09-15 at 19.08.48 (2)',NULL,0,1758463545765);
INSERT INTO article_gallery VALUES('cmftrsjrp002lnrh15vmmvtym','cmfsru31z0003nr643tz4f3xn','/uploads/images/1758463545816-pbjniwu6uye.jpeg','WhatsApp Image 2025-09-15 at 19.08.48','WhatsApp Image 2025-09-15 at 19.08.48',NULL,0,1758463545878);
INSERT INTO article_gallery VALUES('cmftrsjvc002nnrh1qhqhhi03','cmfsru31z0003nr643tz4f3xn','/uploads/images/1758463545933-7vpjqzuhgkj.jpeg','WhatsApp Image 2025-09-15 at 19.08.49 (1)','WhatsApp Image 2025-09-15 at 19.08.49 (1)',NULL,0,1758463546009);
INSERT INTO article_gallery VALUES('cmftrsjy5002pnrh16y7zbest','cmfsru31z0003nr643tz4f3xn','/uploads/images/1758463546062-v3av6fit4.jpeg','WhatsApp Image 2025-09-15 at 19.08.49 (2)','WhatsApp Image 2025-09-15 at 19.08.49 (2)',NULL,0,1758463546109);
INSERT INTO article_gallery VALUES('cmftrsk0p002rnrh1fnqvp7kk','cmfsru31z0003nr643tz4f3xn','/uploads/images/1758463546150-ux2sgs1tcx.jpeg','WhatsApp Image 2025-09-15 at 19.08.49','WhatsApp Image 2025-09-15 at 19.08.49',NULL,0,1758463546201);
INSERT INTO article_gallery VALUES('cmftrsk3e002tnrh14gtvvmlo','cmfsru31z0003nr643tz4f3xn','/uploads/images/1758463546247-an6odg6shrp.jpeg','WhatsApp Image 2025-09-15 at 19.08.50 (1)','WhatsApp Image 2025-09-15 at 19.08.50 (1)',NULL,0,1758463546299);
INSERT INTO article_gallery VALUES('cmftrsk5w002vnrh1dfnh4oj4','cmfsru31z0003nr643tz4f3xn','/uploads/images/1758463546343-712bmyn72xo.jpeg','WhatsApp Image 2025-09-15 at 19.08.50','WhatsApp Image 2025-09-15 at 19.08.50',NULL,0,1758463546389);
CREATE TABLE IF NOT EXISTS "event_gallery" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "eventId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "altText" TEXT,
    "caption" TEXT,
    "captionAr" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT NOW(),
    CONSTRAINT "event_gallery_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nameAr" TEXT,
    "description" TEXT,
    "descriptionAr" TEXT,
    "color" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT NOW(),
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO categories VALUES('cmfsa5u7h0000nrcr8ajvcrfu','Diplomatie','الدبلوماسية','Articles et actualités diplomatiques','مقالات وأخبار دبلوماسية','#3B82F6',1,1758373466669,1758373466669);
INSERT INTO categories VALUES('cmfsa5u830002nrcr4k6xpd56','Diaspora','ثقافة','Malien de l''extérieur','الأحداث الثقافية والتقاليد','#10B981',1,1758373466691,1758414985534);
INSERT INTO categories VALUES('cmfsa5u8x0006nrcrzb7tddgx','Activités diplomatiques','أخبار','Actualités et nouvelles de l''ambassade','أخبار ومستجدات السفارة','#3B82F6',1,1758373466721,1758414817720);
INSERT INTO categories VALUES('cmfsqox4q0003nrkee6dxgu5g','Note de Services','سياسة','Relations politiques et diplomatiques','العلاقات السياسية والدبلوماسية','#EF4444',1,1758401230778,1758415017284);
INSERT INTO categories VALUES('cmfsqox500004nrkeg1vpue5g','AES','استقبال','Réceptions officielles et cérémonies','الاستقبالات الرسمية والاحتفالات','#8B5CF6',1,1758401230789,1758418537479);
INSERT INTO categories VALUES('cmfsqox5c0005nrkeunenqdfs','Libye','مؤتمر','Conférences et séminaires','المؤتمرات والندوات','#d90808',1,1758401230800,1758414844186);
INSERT INTO categories VALUES('cmfsqox5m0006nrkejhw2drht','Malte','ثقافي','Événements culturels et artistiques','الأحداث الثقافية والفنية','#84CC16',1,1758401230810,1758414930418);
INSERT INTO categories VALUES('cmfsqox5x0007nrke6rpl8cvd','CEN-SAT','تدريب','','التدريبات وورش العمل','#F97316',1,1758401230821,1758414959860);
CREATE TABLE IF NOT EXISTS "articles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "titleAr" TEXT,
    "content" TEXT NOT NULL,
    "contentAr" TEXT,
    "excerpt" TEXT,
    "excerptAr" TEXT,
    "slug" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" DATETIME,
    "imageUrl" TEXT,
    "tags" TEXT,
    "categoryId" TEXT,
    "authorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT NOW(),
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "articles_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "admins" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "articles_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO articles VALUES('cmfs521kb0002nrbsr677wbq1','Remerciement','','20 juillet 2025 , dîner d''au revoir et de remerciement de Groupe Africain en l''honneur de SEM l''Ambassadeur de la Tunisie à TRIPOLI avec remise de cadeaux...','','Site officiel de l''Ambassade du Mali en Libye','','remerciement',0,1,1758419607812,'/uploads/1758419733266-8kn14dutgzb.jpeg','["accueil","ambassade","mali","libye"]','cmfsa5u8x0006nrcrzb7tddgx','cmfs521ju0000nrbswqlx0lwq',1758364891499,1758419733300);
INSERT INTO articles VALUES('cmfs55wfh0001nrqfo6wzv3as',' Cérémonie','','31 juillet 2025, cérémonie d''au revoir à son Excellence Monsieur l''Ambassadeur de Tunisie à Tripoli, en fin de mission...','','','','-ceremonie',0,1,1758365071468,'/uploads/1758419546767-kl5rrh4nd28.jpeg','["test","api"]','cmfsa5u8x0006nrcrzb7tddgx','cmfs521ju0000nrbswqlx0lwq',1758365071469,1758419546810);
INSERT INTO articles VALUES('cmfsqbzgi0007nrm7pvj6nidn','visite de courtoisie Guinée','',replace('28 août 2025, le Pr Adama DIAWARA, Chargé d''Affaires a.i de l''Ambassade du Mali à Tripoli rend une visite de courtoisie à son homologue de la République de Guinée, M. Sylla...\nChargé d''Affaires de la Guinée Monsieur Aboubacar Demba SYLLA...','\n',char(10)),'','','','visite-de-courtoisie-guinee',0,1,1758411701459,'/uploads/1758419428988-fytzhelolpk.jpeg','','cmfsa5u8x0006nrcrzb7tddgx','cmfs521ju0000nrbswqlx0lwq',1758400627266,1758419429024);
INSERT INTO articles VALUES('cmfsr877d0009nrm71cnx76re','Visite de courtoisie','',replace('Visite de courtoisie à l''Ambassade du Mali à Tripoli du Chargé d''Affaires désigné de l''Ambassade de la Libye à Bamako... M. Othman... s''apprête à regagner son nouveau poste au Mali....\n27 août 2025... Ambassade du Mali à Tripoli...','\n',char(10)),'','','','visite-de-courtoisie',0,1,1758402130291,'/uploads/1758419266945-pu8877wsiv.jpeg','','cmfsa5u8x0006nrcrzb7tddgx','cmfs521ju0000nrbswqlx0lwq',1758402130297,1758419266980);
INSERT INTO articles VALUES('cmfsrru0d0001nr64maubk6ud','Visite de travail','','Visite de travail à l''Ambassade de la République du Mali à Tripoli des hauts fonctionnaires Libyens, émissaires de son Excellence Monsieur le Ministre libyen des Affaires Étrangères et de la Coopération Internationale de l''État de Libye.','','','','visite-de-travail',0,1,1758411699979,'/uploads/1758419102655-kel4813cwgq.jpeg','','cmfsa5u8x0006nrcrzb7tddgx','cmfs521ju0000nrbswqlx0lwq',1758403046317,1758419102690);
INSERT INTO articles VALUES('cmfsru31z0003nr643tz4f3xn','Journée Culturelle et Sportive de l''AES à Tripoli','مقال تجريبي','02 août 2025, Organisation de la Première Journée Culturelle et Sportive des Ambassades de la Confédération AES à Tripoli.','محتوى المقال التجريبي','','مقتطف من المقال','journee-culturelle-et-sportive-de-laes-a-tripoli',0,1,1758403151349,'/uploads/1758418972080-fd0fqynnx1u.jpeg','test, article, validation','cmfsqox500004nrkeg1vpue5g','cmfs521ju0000nrbswqlx0lwq',1758403151351,1758418972127);
INSERT INTO articles VALUES('cmfsrz1l70005nr64zntmws5z','Signatures livre de condoléances','','Signatures livre de condoléances, par les Trois Chargés d''Affaires de la Confédération AES, ouvert à l''Ambassade du Ghana, suite à la mort accidentelle de ministres et cadres du Ghana.','','','','signatures-livre-de-condoleances',0,1,1758411698733,'/uploads/1758418742215-afet0u9jkd.jpeg','','cmfsa5u8x0006nrcrzb7tddgx','cmfs521ju0000nrbswqlx0lwq',1758403382731,1758418742761);
INSERT INTO articles VALUES('cmft1rn6n0001nrxgi4eahg5w','Rencontre','','30 avril 2025, 2e rencontre des Ambassades de la Confédération AES à Tripoli tenue à l''Ambassade de la République du Niger...','','','','rencontre',0,1,1758419833631,'/uploads/1758419833595-nn74naq30nm.jpeg','','cmfsa5u8x0006nrcrzb7tddgx','cmfs521ju0000nrbswqlx0lwq',1758419833632,1758419833632);
INSERT INTO articles VALUES('cmft1tjra0003nrxgbaunca31','Rencontre (AES)','','30 juin 2025, la 3e rencontre (AES) des Ambassades de la Confédération AES à Tripoli a eu lieu à l''Ambassade du Burkina Faso...en présence de son nouveau Chargé d''Affaires a.i  M. Adama Kindo, celui de la  République du Niger, M.Halidou Djibo Mouctar et du Pr Adama DIAWARA de la République du Mali...','','','','rencontre-aes',0,1,1758419922501,'/uploads/1758419922475-asfax19xrhc.jpeg','','cmfsqox500004nrkeg1vpue5g','cmfs521ju0000nrbswqlx0lwq',1758419922503,1758419922503);
INSERT INTO articles VALUES('cmft1yo5j0005nrxg17t50a14','Visites','',replace('24 janvier 2025, le Chargé d''Affaires a.i de l''Ambassade du Mali à Tripoli reçoit Son Excellence Monsieur l''Ambassadeur de la République Démocratique du Congo à Tripoli, Doyen du Corps Diplomatique...\nA l''occasion de la célébration des de la fête de l''Armée, 20 janvier, et celle de la Souveraineté Retrouvée, le 14 janvier...\nEn plus du Doyen Mbilu de la RDC, on notait la présence de nombreux invités, notamment le Chargé d''Affaires a.i de la République de Guinée et son épouse, les représentants des Ambassades du Burkina Faso et du Niger, la Communauté malienne en Libye et les communautés des pays de la Confédération, du Togo, de la Guinée...','\n',char(10)),'','','','visites',0,1,1758420161479,'/uploads/1758420161450-cbk7fmc3rdf.jpeg','','cmfsa5u8x0006nrcrzb7tddgx','cmfs521ju0000nrbswqlx0lwq',1758420161480,1758420161480);
INSERT INTO articles VALUES('cmft20z0e0007nrxgguoox1xx','Visite','',replace('09 janvier 2025, le Chargé d''Affaires a.i de l''Ambassade du Mali reçu par son Excellence Monsieur l''Ambassadeur de la République de Grèce à Tripoli, après la signature du livre de condoléances, lors du décès du l''ex Premier Ministre de la Grèce...\nSignature du livre de condoléances...','\n',char(10)),'','','','visite',0,1,1758420268861,'/uploads/1758420268832-1opby2f23yv.jpeg','','cmfsa5u8x0006nrcrzb7tddgx','cmfs521ju0000nrbswqlx0lwq',1758420268862,1758420268862);
INSERT INTO articles VALUES('cmft231jn0009nrxgdw7xk0eo','Rencontre (République de Malte)','','Rencontre avec Son Excellence Monsieur Charles Saliba, Ambassadeur de la République de Malte à Tripoli, le 07 janvier 2025, à l''Ambassade de Malte...','','','','rencontre-republique-de-malte',0,1,1758420365459,'/uploads/1758420365430-jw24vcj7krs.jpeg','','cmfsa5u8x0006nrcrzb7tddgx','cmfs521ju0000nrbswqlx0lwq',1758420365460,1758420365460);
INSERT INTO articles VALUES('cmft24ep7000bnrxgok3ahzbq','Signatures du livre de condoléances','','21 juillet 2025, signatures du livre de condoléances à l''Ambassade du Nigéria, par les Chargé d''Affaires du Burkina, du Niger et du Mali, à l''occasion de la disparition de l''ancien Président  Muhammud Buhari, le 13 juillet 2025...','','','','signatures-du-livre-de-condoleances',0,1,1758420429162,'/uploads/1758420429135-hwgcqk6hqqv.jpeg','','cmfsa5u8x0006nrcrzb7tddgx','cmfs521ju0000nrbswqlx0lwq',1758420429163,1758420429163);
INSERT INTO articles VALUES('cmft25zys000dnrxgjjuotc9l','Echanges (Malte)','','21 juillet 2025, Echanges avec SEM Saliba, Ambassadeur de Malte sur le Forum sur les investissements en Afrique, devant se tenir à Bamako, en décembre 2025..','','','','echanges-malte',0,1,1758420503379,'/uploads/1758420503352-0ab092f4eg55.jpeg','','cmfsa5u8x0006nrcrzb7tddgx','cmfs521ju0000nrbswqlx0lwq',1758420503380,1758420503380);
CREATE TABLE IF NOT EXISTS "events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "titleAr" TEXT,
    "description" TEXT NOT NULL,
    "descriptionAr" TEXT,
    "location" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "imageUrl" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" TEXT,
    "authorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT NOW(),
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "events_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "admins" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "events_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO events VALUES('cmfs521kg0004nrbs0ojcbill','Journée de la Culture Malienne','يوم الثقافة المالية','Venez découvrir la richesse de la culture malienne à travers des expositions, des spectacles et des dégustations culinaires.','تعالوا لاكتشاف ثراء الثقافة المالية من خلال المعارض والعروض وتذوق الأطباق التقليدية.','Ambassade du Mali, Tripoli',1758969691503,1758998491503,0,NULL,1,NULL,'cmfs521ju0000nrbswqlx0lwq',1758364891504,1758364891504);
INSERT INTO events VALUES('cmfs9kcby0003nrgtkr2owf0r','Test Galerie - Événement avec images','اختبار المعرض - حدث مع الصور','Ceci est un événement de test pour vérifier le fonctionnement des galeries d''images.','هذا حدث اختبار للتحقق من عمل معارض الصور.','Ambassade du Mali, Tripoli',1758977263648,1759063663650,0,NULL,1,NULL,'cmfs521ju0000nrbswqlx0lwq',1758372463724,1758372463724);
INSERT INTO events VALUES('cmfs9kvcv0005nrgtxaoyqywu','Test Event',NULL,'Test',NULL,'Test',1748772000000,NULL,0,NULL,1,NULL,'cmfs521ju0000nrbswqlx0lwq',1758372488383,1758372488383);
INSERT INTO events VALUES('cmfs9lpbq0007nrgttrpr6dxh','Test Galerie - Événement avec images','اختبار المعرض - حدث مع الصور','Ceci est un événement de test pour vérifier le fonctionnement des galeries d''images.','هذا حدث اختبار للتحقق من عمل معارض الصور.','Ambassade du Mali, Tripoli',1758977327164,1759063727165,0,NULL,1,NULL,'cmfs521ju0000nrbswqlx0lwq',1758372527222,1758372527222);
INSERT INTO events VALUES('cmfsrarr5000bnrm7mtdaxt9a','Événement avec catégorie',NULL,'Description de test',NULL,'Ambassade',1758794400000,NULL,0,NULL,1,'cmfsqox500004nrkeg1vpue5g','cmfs521ju0000nrbswqlx0lwq',1758402250241,1758402250241);
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");
CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");
-- COMMIT;


-- Créer les index pour améliorer les performances
CREATE INDEX IF NOT EXISTS "idx_article_published" ON "Article"("published");
CREATE INDEX IF NOT EXISTS "idx_article_category" ON "Article"("categoryId");
CREATE INDEX IF NOT EXISTS "idx_article_author" ON "Article"("authorId");
CREATE INDEX IF NOT EXISTS "idx_event_date" ON "Event"("eventDate");
CREATE INDEX IF NOT EXISTS "idx_document_public" ON "Document"("isPublic");
CREATE INDEX IF NOT EXISTS "idx_document_category" ON "Document"("category");
CREATE INDEX IF NOT EXISTS "idx_visa_status" ON "VisaApplication"("status");
CREATE INDEX IF NOT EXISTS "idx_contact_created" ON "ContactMessage"("createdAt");

-- Insérer un utilisateur admin par défaut
INSERT INTO "Admin" ("id", "email", "password", "name", "role", "isActive", "createdAt", "updatedAt")
VALUES (
  'admin-001',
  'admin@ambassade-mali-libye.com',
  '$2a$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA',
  'Administrateur Principal',
  'SUPER_ADMIN',
  true,
  NOW(),
  NOW()
) ON CONFLICT ("email") DO NOTHING;

-- Insérer une catégorie par défaut
INSERT INTO "Category" ("id", "name", "nameAr", "description", "descriptionAr", "color", "isActive", "createdAt", "updatedAt")
VALUES (
  'cat-001',
  'Actualités',
  'أخبار',
  'Articles d'actualité de l'ambassade',
  'مقالات إخبارية من السفارة',
  '#3B82F6',
  true,
  NOW(),
  NOW()
) ON CONFLICT ("id") DO NOTHING;

COMMIT;
