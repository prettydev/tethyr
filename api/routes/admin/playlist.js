const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	req.getConnection((err, conn) => {
		if (err) return res.sendStatus(400);
		conn.query(`
			SELECT playlists.*, T.user_ids FROM playlists
				LEFT JOIN (
					SELECT playlist_id, GROUP_CONCAT(gridset_id) user_ids FROM gridset_data
						GROUP BY playlist_id
					) AS T
				ON playlists.id = T.playlist_id
				WHERE active=1
				ORDER BY gspn
		`, (err, rows) => {
			if (err) {
				return res.sendStatus(400);
			}
			const playlists = rows.map(({ active, user_ids, ...rest }) => {
				const users = user_ids ? user_ids.split(',').map(id => +id) : [];
				return {
					...rest,
					users
				}
			});
			res.send({
				playlists
			});
		});
	});
})

router.post('/cubes', (req, res) => {
 const { user_id } = req.body;
 req.getConnection((err, conn) => {
	if (err) return res.sendStatus(400);
	conn.query(`SELECT pl.id, pl.title name FROM playlists pl LEFT JOIN (SELECT pud.playlist_id FROM gridset_data pud WHERE pud.gridset_id = ${user_id}) T ON pl.id = T.playlist_id WHERE T.playlist_id IS NOT NULL`, (err, rows) => {
		if (err) return res.sendStatus(400);
		res.send({
			playlists: rows
		})
	})
 })
})

router.get('/new', (req, res) => {
	req.getConnection((err, conn) => {
		if (err) return res.sendStatus(400);
		conn.query('SELECT gspn FROM playlists ORDER BY gspn DESC LIMIT 1', (err, rows) => {
			if (err) return res.sendStatus(400);
			if (rows.length === 0) return res.send({ gspn: 'GSPN18A0001' })
			let { gspn } = rows[0];
			const num = parseInt(gspn.substr(7)) + 1;
			const numStr = '000' + num.toString();
			gspn = gspn.slice(0, 7) + numStr.substr(numStr.length - 4);
			res.send({ gspn });
		})
	})
});

router.post('/save', (req, res) => {
	const { gspn, title, type, users, description } = req.body;
	req.getConnection((err, conn) => {
		if (err) return res.sendStatus(400);
		conn.query(`SELECT COUNT(*) count FROM playlists WHERE gspn='${gspn}'`, (err, rows) => {
			if (err) return res.sendStatus(400);
			let query;
			let data = null;
			if (rows[0].count > 0) {
				query = `UPDATE playlists SET title='${title}', description='${description}' WHERE gspn='${gspn}'`;
			} else {
				query = `INSERT INTO playlists (gspn, title, description, active) VALUES (?)`;
				data = [[gspn, title, description, type, 1]];
			}
			conn.query(query, data, (err, rows) => {
				if (err) return res.sendStatus(400);
				conn.query(`SELECT id FROM playlists WHERE gspn='${gspn}'`, (err, rows) => {
					if (err) return res.sendStatus(400);
					const playlist_id = rows[0].id;
					conn.query(`DELETE FROM gridset_data WHERE playlist_id=${playlist_id}`, (err) => {
						if (err) return res.sendStatus(400);
						// if (users.length > 0) {
							// const data = users.map(user => [playlist_id, user]);
							conn.query('INSERT INTO gridset_data (playlist_id, gridset_id) VALUES (?, ?)', [playlist_id, users.id], (err) => {
								if (err) return res.sendStatus(400);
								conn.query(`SELECT pl.id, pl.title name FROM playlists pl LEFT JOIN (SELECT pud.playlist_id FROM gridset_data pud WHERE pud.gridset_id = ${users.id}) T ON pl.id = T.playlist_id WHERE T.playlist_id IS NOT NULL`, (err, rows) => {
									if (err) return res.sendStatus(400);
									res.send({
										playlists: rows
									})
								})
							})
						// } else {
						//     res.send({
						//         success: true
						//     });
						// }
					})
				})
			})
		})
	})
})

router.post('/savePlaylist', (req, res) => {
	const { gspn, title, users, description, thumb, password } = req.body;
	req.getConnection((err, conn) => {
		if (err) return res.sendStatus(400);
		conn.query(`SELECT COUNT(*) count FROM playlists WHERE gspn='${gspn}'`, (err, rows) => {
			if (err) return res.sendStatus(400);
			let query;
			let data = null;
			if (rows[0].count > 0) {
				query = `UPDATE playlists SET title='${title}', description='${description}', thumb='${thumb}', password=${password} WHERE gspn='${gspn}'`;
			} else {
				query = `INSERT INTO playlists (gspn, title, description, thumb, password, active) VALUES (?)`;
				data = [[gspn, title, description, thumb, password, 1]];
			}
			conn.query(query, data, (err) => {
				if (err) {console.log(err); return res.sendStatus(400);}
				res.send({
					success : true
				})
				// conn.query(`SELECT id FROM playlists WHERE gspn='${gspn}'`, (err, rows) => {
				// 	if (err) {console.log(err); return res.sendStatus(400);}
				// 	const playlist_id = rows[0].id;
				// 	conn.query(`DELETE FROM gridset_data WHERE playlist_id=${playlist_id}`, (err) => {
				// 		if (err) {console.log(err); return res.sendStatus(400);}
				// 		if (users.length > 0) {
				// 			conn.query(`SELECT DISTINCT(gridset_id),SUM(1) FROM gridset_data WHERE gridset_id IN (${users.map((user) => `${user}`).join(', ')}) GROUP BY(gridset_id) ORDER BY FIND_IN_SET(gridset_id, '${users.map((user) => `${user}`).join(',')}')`, (err, rows) => {
				// 				if (err) return res.sendStatus(400);
				// 				const data = rows.map(row => {
				// 					return [playlist_id, row['gridset_id'], row['SUM(1)']]
				// 				})
				// 				console.log(data);
				// 				conn.query(`INSERT INTO gridset_data (playlist_id, gridset_id, playlist_order) VALUES ?`, [data], (err) => {
				// 					if (err) {console.log(err); return res.sendStatus(400);}
				// 					res.send({
				// 						success: true
				// 					});
				// 				})
				// 			})
				// 		} else {
				// 			res.send({
				// 				success: true
				// 			});
				// 		}
				// 	})
				// })
			})
		})
	})
})

router.post('/addPlaylist', (req, res) => {
	const { id, playlist_id } = req.body;
	req.getConnection((err, conn) => {
		if (err) return res.sendStatus(400);
		conn.query(`SELECT * FROM gridset_data WHERE gridset_id = '${id}' AND playlist_id = ${playlist_id}`, (err, rows) => {
			if (err) return res.sendStatus(400);
			if(rows.length > 0) {
				res.send({
					success : false,
				})
			}
			else {
				conn.query(`SELECT COUNT(*) FROM gridset_data WHERE gridset_id = ${id}`, (err, rows) => {
					if (err) return res.sendStatus(400);
					const order = rows[0]['COUNT(*)'];
					const data = [ playlist_id, id, order ];
					conn.query('INSERT INTO gridset_data(playlist_id, gridset_id, playlist_order) VALUES (?)', [data], (err) => {
						if (err) return res.sendStatus(400);
						conn.query(`SELECT pl.id, pl.gspn, pl.title, playlist_order FROM playlists pl LEFT JOIN (SELECT * FROM gridset_data) pud ON pl.id = pud.playlist_id WHERE gridset_id=${id} AND active=1 ORDER BY pud.playlist_order`, (err, playlists) => {
							if (err) {
								return res.sendStatus(400);
							}
							res.send({
								success : true,
								playlists
							});
						})
					})
				})        
			}
		})
	})
})

router.post('/videos', (req, res) => {
	const { gspn } = req.body;
	req.getConnection((err, conn) => {
		if (err) return res.sendStatus(400);
		getVideos(gspn, conn, (videos) => {
			res.json({
				videos
			});
		})
	})
})

const getVideos = (gspn, conn, callback) => {
	conn.query(`SELECT videos.*, playlist_data.playlist_order p_order FROM videos LEFT JOIN playlist_data ON videos.id = playlist_data.video_id  LEFT JOIN playlists ON playlist_id=playlists.id WHERE gspn='${gspn}' ORDER BY p_order`, (err, rows) => {
		if (err) return res.sendStatus(400);
		const videos = rows.map(({ p_order, video_title, ...rest }) => ({
			video_title: decodeURI(video_title),
			...rest,
			order: p_order
		}));
		callback(videos);
	})
}

router.post('/remove-video', (req, res) => {
	const { gspn, video_id } = req.body;
	req.getConnection((err, conn) => {
		if (err) return res.sendStatus(400);
		conn.query(`SELECT id FROM playlists WHERE gspn='${gspn}'`, (err, rows) => {
			if (err) return res.sendStatus(400);
			const playlist_id = rows[0].id;
			conn.query(`SELECT playlist_order FROM playlist_data WHERE playlist_id=${playlist_id} AND video_id=${video_id}`, (err, rows) => {
				if (err) return res.sendStatus(400);
				const order = rows[0].playlist_order;
				conn.query(`DELETE FROM playlist_data WHERE playlist_id=${playlist_id} AND video_id=${video_id}`, () => {
					conn.query(`UPDATE playlist_data SET playlist_order = playlist_order - 1 WHERE playlist_order > ${order}`, (err, rows) => {
						if (err) return res.sendStatus(400);
						getVideos(gspn, conn, (videos) => {
							res.send({
								videos
							});
						})
					})
				})
			})
		})
	})
})

router.post('/move-video', (req, res) => {
	const { gspn, video_id, swap_video_id } = req.body;
	req.getConnection((err, conn) => {
		if (err) return res.sendStatus(400);
		conn.query(`SELECT id FROM playlists WHERE gspn='${gspn}'`, (err, rows) => {
			if (err) return res.sendStatus(400);
			const playlist_id = rows[0].id;
			conn.query(`SELECT playlist_order FROM playlist_data WHERE playlist_id = ${playlist_id} AND (video_id = ${video_id} OR video_id = ${swap_video_id})`, (err, rows) => {
				if (err) return res.sendStatus(400);
				const playlist_order = rows[0].playlist_order;
				const swap_playlist_order = rows[1].playlist_order;
				conn.query(`
							UPDATE playlist_data SET playlist_order = 
							CASE
							WHEN playlist_order = ${playlist_order} THEN ${swap_playlist_order}
							WHEN playlist_order = ${swap_playlist_order} THEN ${playlist_order}
							ELSE playlist_order
							END
							WHERE playlist_id = ${playlist_id}
						`, (err) => {
							if (err) return res.sendStatus(400);
							getVideos(gspn, conn, (videos) => {
								res.send({
									videos
								});
							})
						})
			})
		})
	})       
})

router.post('/saveCSVData', (req, res) => {
	const { data } = req.body;
	var gspn = data[0][0];
	req.getConnection((err, conn) => {
		if (err) return res.sendStatus(400);
		conn.query(`SELECT id FROM playlists WHERE gspn = "${gspn}"`, (err, rows)=>{
			if(err) return res.sendStatus(400);
			var id = rows[0].id;
			conn.query(`DELETE FROM playlist_data WHERE playlist_id = ${id}`, (err)=>{
				if(err) return res.sendStatus(400);
				var gsvn = [];
				data.map(data=>{
					gsvn.push(data[2]);
				})
				conn.query(`SELECT id FROM videos WHERE gsvn in (${gsvn.map(gsvn => `"${gsvn}"`).join(',')}) ORDER BY FIELD(gsvn,${gsvn.map(gsvn => `"${gsvn}"`).join(',')})`, (err, rows) => {
					if(err) return res.sendStatus(400);
					var playlist  = [];
					rows.map((row, idx)=>{
						var order = parseInt(data[idx][1]);
						playlist.push([id, order, row.id]);
					})
					conn.query('INSERT INTO playlist_data(playlist_id, playlist_order, video_id) VALUES ?', [playlist], (err)=>{
						if(err) return res.sendStatus(400);
						res.send({
							success:true,
						})
					})
				})
			})
		})
	})
})

router.post('/resetPlaylist', (req, res) => {
	const { gspn, videos } = req.body;
	req.getConnection((err, conn) => {
		if (err) return res.sendStatus(400);
		conn.query("SELECT id FROM playlists WHERE gspn = ?", gspn, (err, rows) =>{
			if(err) return res.sendStatus(400);
			const playlist_id = rows[0].id;
			conn.query("SELECT gridset_id FROM gridset_data WHERE playlist_id = ?", playlist_id, (err, rows)=>{
				if(err) return res.sendStatus(400);
				const users = rows.map(row =>{
					return row.user_id
				})
				conn.query(`DELETE FROM user_info WHERE playlist_id =${playlist_id}`, (err) =>{
					if(err) return res.sendStatus(400);
					var data = [];
					users.map(user=>{
						videos.map((video)=>{
							data.push([user, playlist_id, video.id, video.order, 0, 0]);
						})
					}) 
					conn.query('INSERT INTO user_info(user_id, playlist_id, video_id, playlist_order, hidden, dotted) VALUES ?', [data], (err)=>{
						if(err) return res.sendStatus(400);
						res.send({
							success:true,
						})
					})
				})
			})
		})
	})
})

router.post('/setAutoUpdate', (req, res) => {
	const { user_id, gspn,  value } = req.body;
	req.getConnection((err, conn) => {
		if (err) return res.sendStatus(400);
		conn.query("SELECT id FROM playlists WHERE gspn = ?", gspn, (err, rows) =>{
			if(err) return res.sendStatus(400);
			const playlist_id = rows[0].id;
			conn.query(`UPDATE user_playlists SET playlist_auto_update = ${value} WHERE user_id = ${user_id} AND playlist_id = ${playlist_id}`, (err) => {
				if(err) return res.sendStatus(400);
				res.send({
					success:true,
				})
			})
		})
	})
})

router.post('/getPlaylistTitle', (req, res) => {
	const { gspn } = req.body;
	req.getConnection((err, conn) => {
		if (err) return res.sendStatus(400);
		conn.query("SELECT title FROM playlists WHERE gspn = ?", gspn, (err, rows) =>{
			if(err) return res.sendStatus(400);
			res.send({
				title:rows[0].title
			})
		})
	})
})

router.post('/removePlaylist', (req, res) => {
	const { id, gspn } = req.body;
	req.getConnection((err, conn) => {
		if (err) return res.sendStatus(400);
		conn.query("SELECT id FROM playlists WHERE gspn = ?", gspn, (err, rows) =>{
			if(err) return  res.sendStatus(400);
			const playlist_id = rows[0].id;
			conn.query(`SELECT playlist_order FROM gridset_data WHERE gridset_id = ${id} AND playlist_id = ${playlist_id}`, (err, rows) => {
				if(err) return  res.sendStatus(400);
				const playlist_order = rows[0].playlist_order;
				conn.query(`DELETE FROM gridset_data WHERE gridset_id = ${id} AND playlist_id = ${playlist_id}`,(err) => {
					if(err) return res.sendStatus(400);
					conn.query(`
							UPDATE gridset_data SET playlist_order = playlist_order +
							CASE
							WHEN playlist_order > ${playlist_order} THEN -1
							WHEN playlist_order < ${playlist_order} THEN 0
							ELSE 0
							END
							WHERE gridset_id = ${id}
						`, (err) => {
						if (err) return res.sendStatus(400);
						conn.query(`SELECT pl.id, pl.gspn, pl.title, playlist_order FROM playlists pl LEFT JOIN (SELECT * FROM gridset_data) pud ON pl.id = pud.playlist_id WHERE gridset_id=${id} AND active=1 ORDER BY pud.playlist_order`, (err, playlists) => {
							if (err) {
							return res.sendStatus(400);
							}
							res.send({
							playlists
							});
						})
					})
				})
			})
		})
	})
})

router.post('/swapPlaylist', (req, res) => {	
	const { id, gspn, swap_gspn } = req.body;
	req.getConnection((err, conn) => {
		if (err) return res.sendStatus(400);
		conn.query(`SELECT id FROM playlists WHERE gspn = '${gspn}' OR gspn = '${swap_gspn}'`, (err, rows) =>{
			if(err) { console.log(err); return  res.sendStatus(400);}
			const playlist_id = rows[0].id;
			const swap_playlist_id = rows[1].id;
			conn.query(`SELECT playlist_order FROM gridset_data WHERE gridset_id = ${id} AND ( playlist_id = ${playlist_id} OR playlist_id = ${swap_playlist_id})`, (err, rows) => {
				if(err) { console.log(err); return  res.sendStatus(400);}
				const playlist_order = rows[0].playlist_order;
				const swap_playlist_order = rows[1].playlist_order;
				conn.query(`
							UPDATE gridset_data SET playlist_order = 
							CASE
							WHEN playlist_id = ${playlist_id} THEN ${swap_playlist_order}
							WHEN playlist_id = ${swap_playlist_id} THEN ${playlist_order}
							ELSE playlist_order
							END
							WHERE gridset_id = ${id}
						`, (err) => {
						if (err) return res.sendStatus(400);
						conn.query(`SELECT pl.id, pl.gspn, pl.title, playlist_order FROM playlists pl LEFT JOIN (SELECT * FROM gridset_data) pud ON pl.id = pud.playlist_id WHERE gridset_id=${id} AND active=1 ORDER BY pud.playlist_order`, (err, playlists) => {
							if (err) {
								return res.sendStatus(400);
							}
							res.send({
								playlists
							});
						})
				})
			})
		})
	})
})

router.post('/updateSponsored', (req, res) => {
	const { id, value } = req.body;
	req.getConnection((err, conn) => {
		if (err) return res.sendStatus(400);
		conn.query(`UPDATE videos SET sponsored='${value}' WHERE id='${id}'`, (err, rows) => {
			if (err) return res.sendStatus(400);
			res.send({
				success : true,
			})
		})
	})
})

router.post('/setDefaultVideos', (req, res) => {
	const { gspn, videos } = req.body;
	req.getConnection((err, conn) => {
		if (err) return res.sendStatus(400);
		conn.query(`SELECT id FROM playlists WHERE gspn='${gspn}'`, (err, rows) => {
			if (err) return res.sendStatus(400);
			const playlist_id = rows[0].id;
			conn.query(`DELETE FROM playlist_data WHERE playlist_id = ${playlist_id}`, (err)=> {
				if (err) return res.sendStatus(400);
				var data = [];
				videos.map(video=>{
					data.push([playlist_id, video[0], video[1]]);
				})
				conn.query('INSERT INTO playlist_data (playlist_id, playlist_order, video_id) VALUES ? ', [data], (err) => {
					if (err) return res.sendStatus(400);
					res.send({
						success : true,
					})
				})
			})
		})
	})
})

router.post('/userPlaylist', (req, res) => {
	const { user_id, gridsetId } = req.body;
	req.getConnection((err, conn) => {
		if (err) {
			return res.sendStatus(400);
		}
		conn.query(`SELECT pl.gspn, pl.title, pud.playlist_auto_update FROM playlists pl LEFT JOIN user_playlists pud ON pl.id = pud.playlist_id WHERE gridset_id=${gridsetId} AND user_id = ${user_id} AND pl.active=1 ORDER BY pud.playlist_order`, (err, playlists) => {
			if (err) {
				return res.sendStatus(400);
			}
			res.send({
				playlists,
			});
		});
	});
});

module.exports = router;
