const express = require('express');
const router = express.Router();

const { decodeString } = require('../../modules');

router.post('/getPreview/:userId', (req, res) => {
	const { gridset_id } = req.body;
	const { userId } = req.params;
	const result = new Array(8).fill(null);
	req.getConnection((err, conn) => {
		if (err) { console.log(err); return res.sendStatus(400);}
		conn.query(`SELECT ganged_gridset FROM user_gridsets WHERE gridset_id = ${gridset_id} AND user_id = ${userId}`, (err, rows) => {
			if (err) { console.log(err); return res.sendStatus(400);}
			const ganged_gridset = rows[0].ganged_gridset;
			conn.query(`SELECT playlist_id, playlist_ganged FROM user_playlists WHERE gridset_id = ${gridset_id} AND user_id = ${userId} ORDER BY 
										CASE ${ganged_gridset}
											WHEN 1 THEN playlist_ganged
											ELSE 1 END DESC, playlist_order`, (err, rows) => {
				if (err) { console.log(err); return res.sendStatus(400);}
				rows.map(({ playlist_id, playlist_ganged }, idx) => {
					result[idx] = {
						id: playlist_id,
						playlist_ganged: playlist_ganged
					};
				})
				const returnFunc = (playlist) => {
					res.send({
						playlist
					});
				}
				let count = 0;
				result.map((obj, idx) => {
					if (obj === null) {
						count++;
						if (count === 8) {
							returnFunc(result);
						}
						return;
					}
					conn.query(`SELECT videos.*, hidden, dotted, playlist_order  FROM videos LEFT JOIN user_info pd ON videos.id = pd.video_id AND videos.dead = 0 WHERE pd.playlist_id = ${obj.id} AND pd.user_id = ${userId} AND pd.hidden = false ORDER BY pd.playlist_order`, (err, rows) => {
						if (err) { console.log(err); return res.sendStatus(400);}
						const videos = rows.map(({ id, gsvn, video_id, interface_link, video_title, description, video_type, video_author, video_length, episode_title, thumbnail, tags, gotags, category, author_img, author_link, dotted, hidden, playlist_order, sponsored, live_now, datePublish }) => ({
							id: id,
							gsvn: gsvn,
							url: video_id,
							interface: interface_link,
							title: decodeString(video_title),
							description,
							type: video_type,
							author: video_author,
							thumb: thumbnail,
							tags: tags,
							gotags: gotags,
							category: category,
							author_img: author_img,
							authorLink: author_link,
							length: video_length,
							dotted: dotted,
							hidden: hidden,
							order: playlist_order,
							episode_title: episode_title,
							sponsored: sponsored,
							live_now: live_now,
							datePublish: datePublish
						}))
						result[idx].videos = videos;
						count++;
						if (count === 8) {
							returnFunc(result);
						}
					});
				})
			})
		})
	})
})

router.get('/checkUpdate/:userId', (req, res) => {
	const { userId } = req.params;
	req.getConnection((err, conn) => {
		if (err) { console.log(err); return res.sendStatus(400);}
		conn.query(`SELECT DISTINCT(playlist_id) FROM user_playlists WHERE user_id = ${userId} AND playlist_auto_update = '1'`, (err, rows) => {
			if (err) { console.log(err); return res.sendStatus(400);}
			if (rows.length === 0) {
				res.send({
					success: true
				})
			}
			else {
				const playlists = rows.map(({ playlist_id }) => {
					return playlist_id;
				})
				conn.query(`DELETE FROM user_info WHERE user_id = ${userId} AND playlist_id IN (${playlists.map((playlist) => `${playlist}`).join(', ')})`, (err) => {
					if (err) return res.sendStatus(400)
					conn.query(`SELECT playlist_data.playlist_id, playlist_data.playlist_order, playlist_data.video_id
											FROM playlist_data 
											JOIN videos on playlist_data.video_id = videos.id
											WHERE videos.dead = 0 AND playlist_data.playlist_id IN (${playlists.map((playlist) => `${playlist}`).join(', ')})`, (err, rows) => {
						if (err) { console.log(err); return res.sendStatus(400);}
						if (rows.length === 0) {
							res.send({
								success: true
							})
						}
						else {
							const data = rows.map(({ playlist_id, playlist_order, video_id }) => {
								return [userId, playlist_id, video_id, playlist_order, 0, 0];
							})
							conn.query('INSERT INTO user_info(user_id, playlist_id, video_id, playlist_order, hidden, dotted) VALUES ?', [data], (err) => {
								if (err) { console.log(err); return res.sendStatus(400);}
								res.send({
									success: true
								})
							})
						}
					})
				})
			}
		})
	})
})

router.get('/getUserPlaylist/:userId/:gridset_id/:per_page/:page', (req, res) => {
	const { userId, gridset_id, per_page, page } = req.params;
	req.getConnection((err, conn) => {
		if (err) {
			return res.sendStatus(400);
		}
		if (per_page === 'all') {
			conn.query(`SELECT playlists.*, pd.playlist_auto_update, pd.playlist_ganged, pd.ganged_pwd, pd.playlist_order FROM playlists INNER JOIN user_playlists pd ON playlists.id = pd.playlist_id AND pd.user_id = '${userId}' AND pd.gridset_id = '${gridset_id}' ORDER BY pd.playlist_order`, (err, rows) => {
				if (err) {
					return res.sendStatus(400);
				}
				res.send({
					data: rows,
				})
			})
		}
		else {
			conn.query(`SELECT COUNT (*) FROM user_playlists WHERE (user_id = '${userId}' AND gridset_id = '${gridset_id}')`, (err, rows) => {
				if (err) {
					return res.sendStatus(400);
				}
				const total = rows[0]['COUNT (*)'];
				const total_pages = Math.ceil(total / per_page);
				conn.query(`SELECT playlists.*, pd.playlist_auto_update, pd.playlist_ganged, pd.ganged_pwd, pd.playlist_order FROM playlists INNER JOIN user_playlists pd ON playlists.id = pd.playlist_id AND pd.user_id = '${userId}' AND pd.gridset_id = '${gridset_id}' ORDER BY pd.playlist_order LIMIT ${per_page * (page - 1)}, ${per_page}`, (err, rows) => {
					if (err) {
						return res.sendStatus(400);
					}
					else if (total !== 0 && rows.length === 0) {
						conn.query(`SELECT playlists.*, pd.playlist_auto_update, pd.playlist_ganged, pd.ganged_pwd, pd.playlist_order FROM playlists INNER JOIN user_playlists pd ON playlists.id = pd.playlist_id AND pd.user_id = '${userId}' AND pd.gridset_id = '${gridset_id}' ORDER BY pd.playlist_order LIMIT ${per_page * (page - 2)}, ${per_page}`, (err, rows) => {
							if (err) {
								return res.sendStatus(400);
							}
							res.send({
								data: rows,
								page: page - 1,
								per_page,
								total,
								total_pages
							})
						})
					}
					else {
						res.send({
							data: rows,
							page,
							per_page,
							total,
							total_pages
						})
					}
				});
			})
		}
	});
})

router.get('/getPublicPlaylists/:gridset_id/:per_page/:page', (req, res) => {
	const { gridset_id, per_page, page } = req.params;
	req.getConnection((err, conn) => {
		if (err) {
			return res.sendStatus(400);
		}
		conn.query(`SELECT COUNT (*) FROM gridset_data WHERE gridset_id = '${gridset_id}'`, (err, rows) => {
			if (err) {
				return res.sendStatus(400);
			}
			const total = rows[0]['COUNT (*)'];
			const total_pages = Math.ceil(total / per_page);
			conn.query(`SELECT playlists.*, pd.playlist_order FROM playlists INNER JOIN gridset_data pd ON playlists.id = pd.playlist_id AND pd.gridset_id = '${gridset_id}' ORDER BY pd.playlist_order LIMIT ${per_page * (page - 1)}, ${per_page}`, (err, rows) => {
				if (err) {
					return res.sendStatus(400);
				}
				res.send({
					data: rows,
					page,
					per_page,
					total,
					total_pages
				})
			});
		})
	});
})

router.post('/cubes/:userId', (req, res) => {
	const { userId } = req.params;
	const { user_id } = req.body;
	req.getConnection((err, conn) => {
		if (err) { console.log(err); return res.sendStatus(400);}
		conn.query(`SELECT pl.id,pl.gspn, pl.title name, pl.description, pl.password playlist_pwd,pl.owner ,T.playlist_auto_update, T.playlist_ganged, T.ganged_pwd FROM playlists pl LEFT JOIN (SELECT pud.playlist_id, pud.playlist_order, pud.playlist_auto_update, pud.playlist_ganged, pud.ganged_pwd FROM user_playlists  pud  WHERE pud.gridset_id = ${user_id} AND pud.user_id = ${userId}) T ON pl.id = T.playlist_id WHERE T.playlist_id IS NOT NULL ORDER BY T.playlist_ganged DESC, T.playlist_order`, (err, rows) => {
			if (err) { console.log(err); return res.sendStatus(400);}
			res.send({
				playlists: rows,
			})
		})
	})
})

router.post('/new/:userId', (req, res) => {
	const { userId } = req.params;
	const { title, description } = req.body;
	req.getConnection((err, conn) => {
		if (err) { console.log(err); return res.sendStatus(400);}
		conn.query(`SELECT * FROM playlists WHERE title = '${title}' AND owner = '${userId}'`, (err, rows) => {
			if (err) { console.log(err); return res.sendStatus(400);}
			if (rows.length > 0) {
				res.send({
					success: false
				})
			}
			else {
				conn.query('SELECT gspn FROM playlists ORDER BY gspn DESC LIMIT 1', (err, rows) => {
					if (err) { console.log(err); return res.sendStatus(400);}
					getNewGSPN(rows, (gspn) => {
						let query = `INSERT INTO playlists (gspn, title, description, active, owner) VALUES (?)`;
						let data = [[gspn, title, description, 1, userId]];
						conn.query(query, data, (err) => {
							if (err) { console.log(err); return res.sendStatus(400);}
							res.send({
								success: true,
								gspn: gspn
							})
						})
					})
				})
			}
		})
	})
})

const getNewGSPN = (rows, callback) => {
	if (rows.length === 0) callback('GSPN18A0001');
	else {
		let { gspn } = rows[0];
		const num = parseInt(gspn.substr(7)) + 1;
		const numStr = '000' + num.toString();
		gspn = gspn.slice(0, 7) + numStr.substr(numStr.length - 4);
		callback(gspn)
	}
}

router.post('/save/:userId', (req, res) => {
	const { userId } = req.params;
	const { gspn, gridset_id } = req.body;
	req.getConnection((err, conn) => {
		if (err) { console.log(err); return res.sendStatus(400);}
		conn.query(`SELECT id FROM playlists WHERE gspn = '${gspn}'`, (err, rows) => {
			if (err) { console.log(err); return res.sendStatus(400);}
			const playlist_id = rows[0].id;
			conn.query(`SELECT COUNT(*) FROM user_playlists WHERE user_id=${userId} AND gridset_id=${gridset_id}`, (err, rows) => {
				if (err) { console.log(err); return res.sendStatus(400);}
				const last_order = rows[0]['COUNT(*)'];
				const data = [userId, gridset_id, playlist_id, last_order, 0];
				conn.query('INSERT INTO user_playlists(user_id, gridset_id, playlist_id, playlist_order, playlist_auto_update) VALUES (?)', [data], (err) => {
					if (err) { console.log(err); return res.sendStatus(400);}
					conn.query(`SELECT pl.id, pl.title name FROM playlists pl LEFT JOIN (SELECT pud.playlist_id, pud.playlist_order FROM user_playlists  pud  WHERE pud.gridset_id = ${gridset_id} AND pud.user_id = ${userId}) T ON pl.id = T.playlist_id WHERE T.playlist_id IS NOT NULL ORDER BY T.playlist_order`, (err, rows) => {
						if (err) { console.log(err); return res.sendStatus(400);}
						res.send({
							playlists: rows
						})
					})
				})
			})
		})
	})
})

router.post('/importVideo/:userId', (req, res) => {
	const { userId } = req.params;
	const { videos, playlist } = req.body;
	if (videos.length === 0) {
		res.send({
			success: false
		})
	}
	else {
		req.getConnection((err, conn) => {
			if (err) { console.log(err); return res.sendStatus(400);}
			const playlist_id = playlist.id;
			conn.query(`SELECT COUNT(*) FROM user_info WHERE user_id = ${userId} AND playlist_id = ${playlist_id}`, (err, rows) => {
				if (err) { console.log(err); return res.sendStatus(400);}
				const order = rows[0]['COUNT(*)'];
				conn.query(`SELECT id FROM videos WHERE ${videos.map(video => `gsvn = '${video}'`).join(' OR ')}`, (err, rows) => {
					if (err) { console.log(err); return res.sendStatus(400);}
					const video_ids = rows.map(({ id }, idx) => {
						return [userId, playlist_id, id, idx + order, 0, 0];
					})
					conn.query('INSERT INTO user_info(user_id, playlist_id, video_id, playlist_order, hidden, dotted) VALUES ?', [video_ids], (err) => {
						if (err) { console.log(err); return res.sendStatus(400);}
						conn.query(`UPDATE user_playlists SET playlist_auto_update = 0 WHERE user_id = ${userId} AND playlist_id = ${playlist_id}`, (err) => {
							if (err) { console.log(err); return res.sendStatus(400);}
							res.send({
								success: true
							})
						})
					})
				})
			})
		})
	}
})

const getVideos = (playlist_id, userId, hide_filter, conn, callback) => {
	conn.query(`SELECT videos.*, hidden, dotted, playlist_order  FROM videos LEFT JOIN user_info pd ON videos.id = pd.video_id AND videos.dead = 0 WHERE pd.playlist_id = ${playlist_id} AND pd.user_id = ${userId} AND IF (${hide_filter}, 1, pd.hidden = ${hide_filter}) ORDER BY pd.playlist_order`, (err, rows) => {
		if (err) { console.log(err); return res.sendStatus(400);}
		const videos = rows.map(({ id, gsvn, video_id, interface_link, video_title, description, video_type, video_author, video_length, episode_title, thumbnail, tags, gotags, category, author_img, author_link, dotted, hidden, playlist_order, sponsored, live_now, datePublish }) => ({
			id: id,
			gsvn: gsvn,
			url: video_id,
			interface: interface_link,
			title: decodeString(video_title),
			description,
			type: video_type,
			author: video_author,
			thumb: thumbnail,
			tags: tags,
			gotags: gotags,
			category: category,
			author_img: author_img,
			authorLink: author_link,
			length: video_length,
			dotted: dotted,
			hidden: hidden,
			order: playlist_order,
			episode_title: episode_title,
			sponsored: sponsored,
			live_now: live_now,
			datePublish: datePublish
		}))
		callback(videos);
	});
}

router.post('/addPlaylist/:userId', (req, res) => {
	const { video_id, playlist_id, position, playingPlaylists, hideMode } = req.body;
	const { userId } = req.params;
	req.getConnection((err, conn) => {
		if (err) { console.log(err); return res.sendStatus(400);}
		conn.query(`SELECT * FROM user_info WHERE user_id=${userId} AND playlist_id=${playlist_id} AND video_id=${video_id}`, (err, rows) => {
			if (err) { console.log(err); return res.sendStatus(400);}
			if (rows.length !== 0) {
				res.send({
					success: false
				})
			}
			else {
				if (position === 0) {
					conn.query('UPDATE user_info SET playlist_order = playlist_order + 1 WHERE playlist_id = ? AND  user_id = ?', [playlist_id, userId], (err) => {
						if (err) { console.log(err); return res.sendStatus(400);}
						conn.query('INSERT INTO user_info(user_id, playlist_id, video_id, playlist_order) VALUES(?,?,?,?)', [userId, playlist_id, video_id, position], (err) => {
							if (err) { console.log(err); return res.sendStatus(400);}
							if (playingPlaylists === playlist_id) {
								getVideos(playlist_id, userId, hideMode, conn, (videos) => {
									res.send({
										videos
									});
								})
							}
							else {
								res.send({
									success: true,
								})
							}
						})
					})
				}
				else if (position === 1) {
					conn.query('SELECT * FROM user_info WHERE playlist_id = ? AND  user_id = ? ORDER BY playlist_order', [playlist_id, userId], (err, rows) => {
						let length = rows.length;
						let last_order = rows[length - 1].playlist_order;
						if (err) { console.log(err); return res.sendStatus(400);}
						conn.query('INSERT INTO user_info(user_id, playlist_id, video_id, playlist_order) VALUES(?,?,?,?)', [userId, playlist_id, video_id, last_order], (err) => {
							if (err) { console.log(err); return res.sendStatus(400);}
							if (playingPlaylists === playlist_id) {
								getVideos(playlist_id, userId, hideMode, conn, (videos) => {
									res.send({
										videos
									});
								})
							}
							else {
								res.send({
									success: true
								})
							}
						})
					})
				}
			}
		})
	})
})

const checkVideo = async (conn, userId, playlist_id, id) => {
	const util = require('util');
	const query = util.promisify(conn.query).bind(conn);
	const rows = await query(`SELECT * FROM user_info WHERE user_id='${userId}' AND playlist_id='${playlist_id}' AND video_id='${id}'`);
	if (rows.length === 0)
		return false;
	else
		return true;
}

const getVideoInfo = async (conn, video_id) => {
	const util = require('util');
	const query = util.promisify(conn.query).bind(conn);
	const rows = await query(`SELECT video_title FROM videos WHERE id='${video_id}'`);
	return rows[0].video_title
}

const saveVideoInfo = async (conn, userId, playlist_id, video_id, position, idx) => {
	const util = require('util');
	const query = util.promisify(conn.query).bind(conn);
	if (position === 0) {
		const rows = await query('UPDATE user_info SET playlist_order = playlist_order + 1 WHERE playlist_id = ? AND  user_id = ?', [playlist_id, userId]);
		const rows1 = await query('INSERT INTO user_info(user_id, playlist_id, video_id, playlist_order) VALUES(?,?,?,?)', [userId, playlist_id, video_id, idx]);
		return true;
	}
	else if (position === 1) {
		const rows = await query(`SELECT * FROM user_info WHERE playlist_id = ${playlist_id} AND  user_id = ${userId} ORDER BY playlist_order`);
		let length = rows.length;
		let last_order = rows[length - 1].playlist_order;
		const rows1 = await query('INSERT INTO user_info(user_id, playlist_id, video_id, playlist_order) VALUES(?,?,?,?)', [userId, playlist_id, video_id, last_order + idx + 1]);
		return true;
	}
	else {
		return false;
	}
}

router.post('/addYoutubePlaylist/:userId', (req, res) => {
	const { video_ids, playlist_id, position, playingPlaylists, hideMode } = req.body;
	const { userId } = req.params;
	req.getConnection(async (err, conn) => {
		if (err) { console.log(err); return res.sendStatus(400);}
		let promise = await Promise.all(video_ids.map(async ({ id }) => {
			return {
				flag: await checkVideo(conn, userId, playlist_id, id),
				video_id: id
			}
		}))
		let promise1 = await Promise.all(promise.map(async ({ flag, video_id }, idx) => {
			if (flag) {
				return {
					flag: true,
					video_title: await getVideoInfo(conn, video_id)
				}
			}
			else {
				return {
					flag: false,
					video_title: await saveVideoInfo(conn, userId, playlist_id, video_id, position, idx),
				}
			}
		}))
		if (playingPlaylists === playlist_id) {
			getVideos(playlist_id, userId, hideMode, conn, (videos) => {
				res.send({
					videos,
					promise1
				});
			})
		}
		else {
			res.send({
				success: true,
				promise1
			})
		}
	})
})

router.post('/reorder/:userId', (req, res) => {
	const { playlist_id, newIndex, oldIndex, hide_filter } = req.body;
	const { userId } = req.params;
	req.getConnection((err, conn) => {
		if (err) { console.log(err); return res.sendStatus(400);}
		conn.query('SELECT video_id FROM user_info WHERE playlist_id = ? AND user_id = ? AND playlist_order = ?', [playlist_id, userId, oldIndex], (err, rows) => {
			if (err) { console.log(err); return res.sendStatus(400);}
			let video_id = rows[0].video_id;
			conn.query(`UPDATE user_info SET playlist_order = IF (${newIndex} > ${oldIndex}, playlist_order - 1, playlist_order + 1) WHERE playlist_id = ${playlist_id} AND user_id = ${userId} AND IF (${newIndex} > ${oldIndex},playlist_order > ${oldIndex} AND playlist_order < ${newIndex} + 1, playlist_order > ${newIndex} - 1 AND playlist_order < ${oldIndex}) `, (err) => {
				if (err) { console.log(err); return res.sendStatus(400);}
				conn.query('UPDATE user_info SET playlist_order = ? WHERE playlist_id = ? AND user_id = ? AND video_id = ?  ', [newIndex, playlist_id, userId, video_id], (err) => {
					if (err) { console.log(err); return res.sendStatus(400);}
					res.send({
						success: true,
					})
				})
			})
		})
	})
})

router.post('/saveRating/:userId', (req, res) => {
	const { ratingValue, video_id } = req.body;
	const { userId } = req.params;
	req.getConnection((err, conn) => {
		if (err) { console.log(err); return res.sendStatus(400);}
		conn.query(`UPDATE user_info SET dotted = ${ratingValue} WHERE video_id = ${video_id} AND user_id = ${userId}`, (err) => {
			if (err) { console.log(err); return res.sendStatus(400);}
			res.send({
				success: true
			})
		})
	})
})

router.post('/filterSearch/:userId', (req, res) => {
	const { dotValue, hideValue, filterValue, playlist_id } = req.body;
	const { userId } = req.params;
	req.getConnection((err, conn) => {
		if (err) { console.log(err); return res.sendStatus(400);}
		conn.query(`SELECT * FROM (SELECT * FROM (SELECT videos.* , dotted, hidden, playlist_order FROM videos LEFT JOIN user_info pd ON videos.id = pd.video_id AND videos.dead = 0 WHERE pd.playlist_id = ${playlist_id} AND pd.user_id = ${userId} AND IF (${dotValue}, pd.dotted = 1, 1)) v WHERE CONCAT(v.video_type, '', v.video_title, '', v.description, '', v.video_author) LIKE "%${filterValue}%") d WHERE IF (${hideValue}, 1, d.hidden = 0) ORDER BY d.playlist_order`, (err, rows) => {
			if (err) { console.log(err); return res.sendStatus(400);}
			const videos = rows.map(({ id, gsvn, video_id, interface_link, video_title, description, video_type, video_author, video_length, episode_title, thumbnail, tags, gotags, category, author_img, author_link, dotted, hidden, playlist_order, sponsored, live_now, datePublish }) => ({
				id: id,
				gsvn: gsvn,
				url: video_id,
				interface: interface_link,
				title: decodeString(video_title),
				description,
				type: video_type,
				author: video_author,
				thumb: thumbnail,
				tags: tags,
				gotags: gotags,
				category: category,
				author_img: author_img,
				authorLink: author_link,
				length: video_length,
				dotted: dotted,
				hidden: hidden,
				order: playlist_order,
				episode_title: episode_title,
				sponsored: sponsored,
				live_now: live_now,
				datePublish: datePublish
			}))
			res.send({ videos });
		});
	})
})

router.post('/resetPlaylist/:userId', (req, res) => {
	const { userId } = req.params;
	const { playlist_id } = req.body;
	req.getConnection((err, conn) => {
		if (err) { console.log(err); return res.sendStatus(400);}
		conn.query("SELECT gspn, title FROM playlists WHERE id = ?", playlist_id, (err, rows) => {
			if (err) { console.log(err); return res.sendStatus(400);}
			const gspn = rows[0].gspn;
			const title = rows[0].title;
			conn.query(`DELETE FROM user_info WHERE playlist_id =${playlist_id} AND user_id=${userId}`, (err) => {
				if (err) { console.log(err); return res.sendStatus(400);}
				conn.query(`SELECT videos.*, playlist_order  FROM videos LEFT JOIN playlist_data pd ON videos.id = pd.video_id AND videos.dead = 0 WHERE pd.playlist_id = ${playlist_id} ORDER BY pd.playlist_order`, (err, rows) => {
					if (err) { console.log(err); return res.sendStatus(400);}
					
					if (!rows[0]) {
						res.send({
							gspn: null,
							title
						})
					}
					else {
						var data = [];
						rows.map((row) => {
							data.push([userId, playlist_id, row.id, row.playlist_order, 0, 0]);
						})
						conn.query('INSERT INTO user_info(user_id, playlist_id, video_id, playlist_order, hidden, dotted) VALUES ?', [data], (err) => {
							if (err) { console.log(err); return res.sendStatus(400);}
							res.send({
								gspn,
								title
							})
						})
					}
				})
			})
		})
	})
})

router.post('/getPlaylistInfo', (req, res) => {
	const { playlist_id } = req.body;
	req.getConnection((err, conn) => {
		if (err) { console.log(err); return res.sendStatus(400);}
		conn.query("SELECT gspn, title FROM playlists WHERE id = ?", playlist_id, (err, rows) => {
			if (err) { console.log(err); return res.sendStatus(400);}
			const gspn = rows[0].gspn;
			const title = rows[0].title
			res.send({
				gspn,
				title
			})
		})
	})
})

router.put('/setAutoUpdate/:userId', (req, res) => {
	const { userId } = req.params;
	const { id, value } = req.body;
	let playlist_auto_update = value === 0 ? 1 : 0;
	req.getConnection((err, conn) => {
		if (err) { console.log(err); return res.sendStatus(400);}
		conn.query(`UPDATE user_playlists SET playlist_auto_update = ${playlist_auto_update} WHERE user_id = ${userId} AND playlist_id = ${id} `, (err) => {
			if (err) { console.log(err); return res.sendStatus(400);}
			res.send({
				success: true
			})
		})
	})
})

router.post('/setDefaultVideos', (req, res) => {
	const { id, videos } = req.body;
	req.getConnection((err, conn) => {
		if (err) { console.log(err); return res.sendStatus(400);}
		conn.query(`SELECT video_id, playlist_order FROM playlist_data WHERE playlist_id = ${id}`, (err, rows) => {
			if (err) { console.log(err); return res.sendStatus(400);}
			var default_videos = rows.map(({ video_id, playlist_order }) => {
				return [playlist_order, video_id];
			})
			checkPlaylistUpdate(videos, default_videos, (flagValue) => {
				if (flagValue) {
					res.send({
						success: false
					})
				}
				else {
					conn.query(`DELETE FROM playlist_data WHERE playlist_id = ${id}`, (err) => {
						if (err) { console.log(err); return res.sendStatus(400);}
						var data = [];
						videos.map(video => {
							data.push([id, video[0], video[1]]);
						})
						conn.query('INSERT INTO playlist_data (playlist_id, playlist_order, video_id) VALUES ? ', [data], (err) => {
							if (err) { console.log(err); return res.sendStatus(400);}
							res.send({
								success: true
							})
						})
					})
				}
			})
		})
	})
})

router.post('/takePublicPlaylist/:userId', (req, res) => {
	const { userId } = req.params;
	const { gridset_id, playlist_id } = req.body;
	req.getConnection((err, conn) => {
		if (err) { return res.sendStatus(400); }
		conn.query(`SELECT * FROM user_playlists WHERE user_id = '${userId}' AND gridset_id = '${gridset_id}' AND playlist_id = '${playlist_id}'`, (err, rows) => {
			if (err) { return res.sendStatus(400); }
			if (rows.length > 0) {
				res.send({
					success: false,
				})
			}
			else {
				conn.query(`SELECT COUNT (*) FROM user_playlists WHERE user_id = '${userId}' AND gridset_id = '${gridset_id}'`, (err, rows) => {
					if (err) { return res.sendStatus(400); }
					const order = rows[0]['COUNT (*)'];
					conn.query('INSERT INTO user_playlists(user_id, gridset_id, playlist_id, playlist_order, playlist_auto_update) VALUES(?, ?, ?, ?, ?)', [userId, gridset_id, playlist_id, order, 1], (err) => {
						if (err) { return res.sendStatus(400); }
						conn.query(`SELECT * FROM user_info WHERE user_id = '${userId}' AND playlist_id = '${playlist_id}'`, (err, rows) => {
							if (err) { return res.sendStatus(400); }
							if (rows.length > 0) {
								res.send({
									success: true,
								})
							}
							else {
								conn.query(`SELECT * FROM playlist_data WHERE playlist_id = '${playlist_id}'`, (err, rows) => {
									if (err) { return res.sendStatus(400); }
									if (rows.length > 0) {
										const user_videos = rows.map(({ playlist_id, playlist_order, video_id }) => {
											return [userId, playlist_id, video_id, playlist_order];
										})
										conn.query('INSERT INTO user_info(user_id, playlist_id, video_id, playlist_order) VALUES ?', [user_videos], (err) => {
											if (err) { return res.sendStatus(400); }
											res.send({
												success: true,
											})
										})
									}
									else {
										res.send({
											success: true,
										})
									}
								})
							}
						})
					})
				})
			}
		})
	});
})

router.post('/editUserPlaylist/:userId', (req, res) => {
	const { playlist_id, title, description, password } = req.body;
	const { userId } = req.params;
	req.getConnection((err, conn) => {
		if (err) {
			return res.sendStatus(400);
		}
		conn.query(`SELECT * FROM playlists WHERE id = '${playlist_id}'`, (err, rows) => {
			if (err) { console.log(err); return res.sendStatus(400);}
			const t = rows[0].title;
			const d = rows[0].description;
			const p = rows[0].password;

			if (title == t) {
				if (password != p && description != d) {
					conn.query(`UPDATE playlists SET description= '${description}', password= '${password}' WHERE id = '${playlist_id}'`, (err) => {
						if (err) {
							return res.sendStatus(400);
						}
						res.send({
							success: true,
						})
					})
				}
				else if (password != p) {
					conn.query(`UPDATE playlists SET password= '${password}' WHERE id = '${playlist_id}'`, (err) => {
						if (err) {
							return res.sendStatus(400);
						}
						res.send({
							success: true,
						})
					})
				}
				else if (description != d) {
					conn.query(`UPDATE playlists SET description= '${description}' WHERE id = '${playlist_id}'`, (err) => {
						if (err) {
							return res.sendStatus(400);
						}
						res.send({
							success: true,
						})
					})
				}
				else {
					res.send({
						success: false
					})
				}
			}
			else {
				conn.query(`SELECT * FROM playlists WHERE title = '${title}'`, (err, rows) => {
					if (err) {
						return res.sendStatus(400);
					}
					if (rows.length > 1) {
						res.send({
							success: false,
						})
					}
					else {
						conn.query(`UPDATE playlists SET title = '${title}', description = '${description}', password= '${password}' WHERE id = '${playlist_id}'`, (err) => {
							if (err) {
								return res.sendStatus(400);
							}
							res.send({
								success: true,
							})
						})
					}
				})
			}
		}
		)
	});
})

router.post('/saveUserPlaylistOrders/:userId', (req, res) => {
	const { gridset_id, items } = req.body;
	const { userId } = req.params;
	const data = items.map(({ id, playlist_auto_update, playlist_ganged, ganged_pwd }, index) => {
		return [userId, gridset_id, id, playlist_auto_update, playlist_ganged, ganged_pwd, index];
	})
	req.getConnection((err, conn) => {
		if (err) {
			return res.sendStatus(400);
		}
		conn.query(`DELETE FROM user_playlists WHERE user_id = '${userId}' AND gridset_id = '${gridset_id}'`, (err) => {
			if (err) {
				return res.sendStatus(400);
			}
			conn.query('INSERT INTO user_playlists(user_id, gridset_id, playlist_id, playlist_auto_update, playlist_ganged, ganged_pwd, playlist_order) VALUES ?', [data], (err) => {
				if (err) {
					return res.sendStatus(400);
				}
				res.send({
					success: true,
				})
			})
		})
	});
})

const checkPlaylistUpdate = (videos, default_videos, callback) => {
	var _ = require('lodash');
	var flag = _.isEqual(_.sortBy(videos), _.sortBy(default_videos));
	callback(flag);
}

module.exports = router;
