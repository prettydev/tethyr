const express = require('express');
const { decodeString } = require('../../../helpers/decodeString');
const router = express.Router();

router.get('/getTypes', (req, res) => {
		req.getConnection((err, conn) => {
				if (err) return res.sendStatus(400);
				conn.query(`
						SELECT DISTINCT video_type FROM videos
				`, (err, rows) => {
						if (err) return res.sendStatus(400);
						res.send({
								video_types : rows,
						})
				})
		})
})

router.get('/getUserVideo/:userId/:playlist_id/:per_page/:page', (req, res) => {
	const { userId, playlist_id, per_page, page } = req.params;
	req.getConnection((err, conn) => {
		if (err) {
			return res.sendStatus(400);
		}
		conn.query(`SELECT COUNT (*) FROM videos LEFT JOIN user_info pd ON videos.id = pd.video_id AND videos.dead = 0 WHERE pd.playlist_id = '${playlist_id}' AND pd.user_id = '${userId}'`, (err, rows) => {
									if (err) {
										return res.sendStatus(400);
									}
									const total = rows[0]['COUNT (*)'];
									const total_pages = Math.ceil( total / per_page );
									conn.query(`SELECT videos.* , dotted, hidden, playlist_order FROM videos LEFT JOIN user_info pd ON videos.id = pd.video_id AND videos.dead = 0 WHERE pd.playlist_id = '${playlist_id}' AND pd.user_id = '${userId}' ORDER BY pd.playlist_order LIMIT ${per_page * (page - 1)}, ${per_page}`, (err, rows) => {
										if (err) {
											return res.sendStatus(400);
										}
										else if(total !== 0 && rows.length === 0) {
											conn.query(`SELECT videos.* , dotted, hidden, playlist_order FROM videos LEFT JOIN user_info pd ON videos.id = pd.video_id AND videos.dead = 0 WHERE pd.playlist_id = '${playlist_id}' AND pd.user_id = '${userId}' ORDER BY pd.playlist_order LIMIT ${per_page * (page - 2)}, ${per_page}`, (err, rows) => {
												if (err) {
													return res.sendStatus(400);
												}
												res.send({
													data : rows,
													page : page -1,
													per_page,
													total,
													total_pages
												})
											})
										}
										else {
											res.send({
												data : rows,
												page,
												per_page,
												total,
												total_pages
											})
										}
									});
							})
	});
})

router.get('/getPublicVideo/:playlist_id/:per_page/:page', (req, res) => {
	const { playlist_id, per_page, page } = req.params;
	console.log(playlist_id, per_page, page)
	req.getConnection((err, conn) => {
		if (err) {
			return res.sendStatus(400);
		}
		conn.query(`SELECT COUNT (*) FROM videos LEFT JOIN playlist_data pd ON videos.id = pd.video_id AND videos.dead = 0 WHERE pd.playlist_id = '${playlist_id}'`, (err, rows) => {
									if (err) {
										console.log(err);
										return res.sendStatus(400);
									}
									const total = rows[0]['COUNT (*)'];
									const total_pages = Math.ceil( total / per_page );
									conn.query(`SELECT videos.*, playlist_order FROM videos LEFT JOIN playlist_data pd ON videos.id = pd.video_id AND videos.dead = 0 WHERE pd.playlist_id = '${playlist_id}' ORDER BY pd.playlist_order LIMIT ${per_page * (page - 1)}, ${per_page}`, (err, rows) => {
										if (err) {
											console.log(err);
											return res.sendStatus(400);
										}
										res.send({
											data : rows,
											page,
											per_page,
											total,
											total_pages
										})
									});
							})
	});
})

router.post('/validate', (req, res) => {
	 
		const { link } = req.body;
		let token = req.headers['authorization'];
		var request = require('request');
		var url = `${process.env.REACT_APP_LOGIN_URL}/api/me`;
		var headers = { 
			Authorization: `${token}`
		};
		// request.get({ url: url,  headers: headers }, function (e, r, body) {
		//     if(!e && r.statusCode == 200) {
						req.getConnection((err, conn) => {
								if (err) {
										return res.send({
												error: true
										});
								}
								conn.query(`SELECT id FROM videos WHERE interface_link='${link}'`, (err, rows) => {
										if (err) {
												return res.send({
														error: true
												});
										}
										if (rows.length > 0) {
												return res.send({
														status: 2
												})
										}
										const type = validateLink({link});
										if (type === null) {
												return res.send({
														status: 1
												})
										}
										generateGSVN(conn, (err, gsvn) => {
												if (err) return res.sendStatus(400);
												res.send({
														status: 0,
														gsvn,
														type,
												});
										});
								})
						});
		//     }
		//     else {
		//         res.send({ status: 401, message: 'Unauthorized request!'});
		//     }
		// });
})

const validateLink = (data) => {
		const video_types = [
				{
						regex: /(http|https):\/\/www.ustream.tv\/embed\/\d+\?html5ui/,
						type: 'ustream'
				},
				{
						regex: /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})|youtube\.com\/playlist\?list=/,
						type: 'youtube'
				},
				{
						regex: /facebook\.com\/([^/?].+\/)?video(s|\.php)[/?].*$/,
						type: 'facebook'
				},
				{
						regex: /^(?:(?:https?):)?(?:\/\/)?(?:www\.)?(?:(?:dailymotion\.com(?:\/embed)?\/video)|dai\.ly)\/([a-zA-Z0-9]+)(?:_[\w_-]+)?$/,
						type: 'dailymotion'
				},
				{
						regex: /(?:www\.|go\.)?twitch\.tv\/([a-z0-9_]+)($|\?)/,
						type: 'twitch'
				},
				{
						regex: /vimeo\.com\/.+/,
						type: 'vimeo'
				},
				{
						regex: /(?:wistia\.com|wi\.st)\/(?:medias|embed)\/(.*)$/,
						type: 'wista'
				}
		];
		let type = null;
		for (let i = 0; i < video_types.length; i ++) {
				if (video_types[i].regex.test(data.link)) {
						type = video_types[i].type;
						break;
				}
		}
		if (type) {
				let { link } = data;
				switch(type) {
						case 'youtube':
								let video_id;
								let pos = -1;
								if (link.indexOf('https://') !== -1) link = link.slice(8);
								if (link.indexOf('http://') !== -1) link = link.slice(7);
								if (link.indexOf('www.youtube.com/watch?v=') !== -1) {
										link = link.slice(24);
										pos = link.indexOf('#');
										if (pos === -1) pos = link.indexOf('&');
								} else if (link.indexOf('youtu.be/') !== -1) {
										link = link.slice(9);
										pos = link.indexOf('?');
								} else if (link.indexOf('www.youtube.com/embed/') !== -1) {
										link = link.slice(22);
										pos = link.indexOf('?');
								}
								if (pos !== -1) link = link.slice(0, pos);
								video_id = link;
								data.link = `https://www.youtube.com/watch?v=${video_id}`;
								break;
				}
				return type;
		}
		return type;
}

const generateGSVN = (conn, callback) => {
		let gsvn = 'GSVN18'
		const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		for (let i = 0; i < 24; i ++) {
				gsvn += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		conn.query(`SELECT COUNT(*) FROM videos WHERE gsvn='${gsvn}'`, (err, rows) => {
				if (err) return callback(err);
				const count = rows[0]['COUNT(*)']
				if (count !== 0) {
						generateGSVN(conn, callback);
				} else {
						callback(null, gsvn);
				}
		})
}

const generateGSVN1 = async (conn) => {
		const util = require('util');
		const query = util.promisify(conn.query).bind(conn);

		while(1) {
				let gsvn = 'GSVN18'
				const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
				for (let i = 0; i < 24; i ++) {
						gsvn += possible.charAt(Math.floor(Math.random() * possible.length));
				}
				const rows = await query(`SELECT COUNT(*) FROM videos WHERE gsvn='${gsvn}'`);
				const count = rows[0]['COUNT(*)']
				if(count === 0) {
						return gsvn;
				}
		}
}

router.post('/updateTwitch', (req, res) => {
		const { video } = req.body;
		video.video_title = encodeURI(video.video_title);
		req.getConnection((err, conn) => {
				if (err) return res.sendStatus(400);
				const fields = [
						'video_title',
						'description',
						'game',
						'thumbnail',
						'tags',
						'live_now',
				];
				const query = 'UPDATE videos SET ' + fields.map(field => `${field} = ${JSON.stringify(video[field] || null)}`).join(', ') + ` WHERE video_id='${video.video_id}'`;
				conn.query(query, (err) => {
						if (err)
						{
								return res.sendStatus(400);
						}
						res.send({
								success : true,
						});
				});
		});
})

router.post('/saveVideos/:userId', (req, res) => {
		const { userId } = req.params;
		const { video } = req.body;
		video.video_title = encodeURI(video.video_title);
		var date = new Date();
		date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() ;
		let token = req.headers['authorization'];
		var request = require('request');
		var url = `${process.env.REACT_APP_LOGIN_URL}/api/me`;
		var headers = { 
			Authorization: `${token}`
		};
		// request.get({ url: url,  headers: headers }, function (e, r, body) {
		//     if(!e && r.statusCode == 200) {
						req.getConnection((err, conn) => {
								if (err) return res.sendStatus(400);
								const isNew = video.id === undefined;
								if (isNew) {
										const fields = [
												'gsvn',
												'video_type',
												'video_id',
												'interface_link',
												'video_title',
												'video_author',
												'description',
												'game',
												'episode_title',
												'thumbnail',
												'tags',
												'gotags',
												'category',
												'note',
												'video_length',
												'channel',
												'dead',
												'embed_restricted',
												'ptll',
												'live_now',
												'author_link',
												'author_img',
												'dateAdded',
												'dateAddedUserId',
												'datePublish'
										];
										const values = [];
										generateGSVN(conn, (err, gsvn) => {
												if (err) return callback(err);
												fields.map(field => values.push(video[field] || null));
												values[0] = gsvn;
												values[16] = 0;
												values[22] = date
												values[23] = userId;
												conn.query(`SELECT * FROM videos WHERE interface_link = '${video['interface_link']}'`, (err, rows) => {
														if (err) res.sendStatus(400);
														if(rows.length !== 0) {
																res.send({
																		success : false,
																		video_id : rows[0].id
																})
														}
														else {
																conn.query(`INSERT INTO videos(gsvn, video_type, video_id, interface_link, video_title, video_author, description, game, episode_title, thumbnail, tags, gotags, category, note, video_length, channel, dead, embed_restricted, ptll, live_now, author_link, author_img, dateAdded, dateAddedUserId, datePublish) VALUES(?)`, [values] , (err, rows) => {
																		if (err) res.sendStatus(400);
																		video.id = rows.insertId;
																		res.send({
																				success: true,
																				video
																		});
																})
														}
												})
												
										})
										
								} else {
										const fields = [
												'video_type',
												'video_id',
												'video_title',
												'video_author',
												'description',
												'game',
												'episode_title',
												'thumbnail',
												'tags',
												'gotags',
												'category',
												'note',
												'channel',
												'embed_restricted',
												'ptll',
												'live_now',
												'author_link',
												'author_img',
												'datePublish'
										];
										const query = 'UPDATE videos SET ' + fields.map(field => `${field} = ${JSON.stringify(video[field] || null)}`).join(', ') + `, video_length = ${video.video_length} WHERE video_id='${video.video_id}'`;
										conn.query(query, (err) => {
												if (err)
												{
														return res.sendStatus(400);
												}
												 
												res.send({
														video
												});
										});
								}
						});
		//     }
		//     else {
		//         res.send({ status: 401, message: 'Unauthorized request!'});
		//     }
		// });
})

const getGSVN = async (conn, interface_link) => {
		const util = require('util');
		const query = util.promisify(conn.query).bind(conn);
		const rows = await query(`SELECT gsvn FROM videos WHERE interface_link='${interface_link}'`);
		if(rows.length === 0)
				return null;
		else 
				return rows[0].gsvn
}

const saveVideoInfo = async (conn, userId, gsvn, video, flag) => {
		const util = require('util');
		const query = util.promisify(conn.query).bind(conn);
		if(flag === null) {
				video.video_title = encodeURI(video.video_title);
				var date = new Date();
				date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() ;
				const fields = [
						'gsvn',
						'video_type',
						'video_id',
						'interface_link',
						'video_title',
						'video_author',
						'description',
						'game',
						'episode_title',
						'thumbnail',
						'tags',
						'gotags',
						'category',
						'note',
						'video_length',
						'channel',
						'dead',
						'embed_restricted',
						'ptll',
						'live_now',
						'author_link',
						'author_img',
						'dateAdded',
						'dateAddedUserId',
						'datePublish'
				];
				const values = [];
				fields.map(field => values.push(video[field] || null));
				values[0] = gsvn;
				values[16] = 0;
				values[22] = date
				values[23] = userId;
				const rows = await query(`INSERT INTO videos(gsvn, video_type, video_id, interface_link, video_title, video_author, description, game, episode_title, thumbnail, tags, gotags, category, note, video_length, channel, dead, embed_restricted, ptll, live_now, author_link, author_img, dateAdded, dateAddedUserId, datePublish) VALUES (?)`, [values]);
				return rows.insertId
		}
		else {
				const rows = await query(`SELECT id FROM videos WHERE interface_link='${video.interface_link}'`);
				return rows[0].id
		}
}

router.post('/saveYoutubeVideos/:userId', (req, res) => {
		const { userId } = req.params;
		const { videos } = req.body;
		req.getConnection(async (err, conn) => {
				if (err) return res.sendStatus(400);
				let promise = await Promise.all(videos.map(async video => {
						return {
								gsvn : await getGSVN(conn, video.interface_link),
								flag : await getGSVN(conn, video.interface_link),
								video
						}
				}))
				let promise1 = await Promise.all(promise.map(async ({gsvn, video, flag}) => {
						if(gsvn === null) {
								return {
										gsvn :  await generateGSVN1(conn),
										video,
										flag
								}
						}
						else {
								return {
										gsvn,
										video,
										flag
								}
						}
				}))
				let promise2 = await Promise.all(promise1.map(async ({gsvn, video, flag}) => {
						return {
								id : await saveVideoInfo(conn, userId, gsvn, video, flag)
						}
				}))
				res.send({
						ids : promise2
				})
		});
})

router.post('/playlists', (req, res) => {
	 
		let token = req.headers['authorization'];
		var request = require('request');
		var url = `${process.env.REACT_APP_LOGIN_URL}/api/me`;
		var headers = { 
			Authorization: `${token}`
		};
		// request.get({ url: url,  headers: headers }, function (e, r, body) {
		//     if(!e && r.statusCode == 200) {
						req.getConnection((err, conn) => {
								if (err) return res.sendStatus(400);
								conn.query(`SELECT pl.*, IF(pd.playlist_id IS NULL, false, true) include FROM playlists pl LEFT JOIN playlist_data pd on pl.id=pd.playlist_id and pd.video_id=${video_id} ORDER BY pl.id ASC`, (err, rows) => {
										if (err) return res.sendStatus(400);
										res.send({
												playlists: rows
										});
								})
						});
		//     }
		//     else {
		//         res.send({ status: 401, message: 'Unauthorized request!'});
		//     }
		// });
})

const removeDuplicatedValues = (video_ids, duplicated_id, callback) => {
		var video_idxs = video_ids.filter(function(element) {
				return duplicated_id.indexOf(element) === -1;
			});
			callback(video_idxs)
}

router.post('/addtoplaylist/:userId', (req, res) => {
		const { userId } = req.params;
		const { video_ids, playlist_id, positionValue } = req.body;
		let duplicated_id = [];
		req.getConnection((err, conn) => {
				if (err) return res.sendStatus(400);
				conn.query(`SELECT * FROM user_info WHERE user_id = ${userId} AND playlist_id = ${playlist_id} AND (${video_ids.map(id => `video_id="${id}"`).join(' OR ')})`, (err, rows) => {
						if (err) return res.sendStatus(400);
						if(rows.length !== 0) {
								duplicated_id = rows.map(({video_id}) => {
										return video_id;
								})
						}
						removeDuplicatedValues(video_ids, duplicated_id, (video_idxs) => {
								if(video_idxs.length === 0)
										res.send({ success : false });
								else {
										if(positionValue == "0") {
												const data = video_idxs.map((video_id, idx) => {
														return [userId, playlist_id, video_id, idx, 0, 0];
												})
												const order = video_idxs.length;
												conn.query('UPDATE user_info SET playlist_order = playlist_order + ? WHERE playlist_id = ? AND  user_id = ?', [order, playlist_id, userId], (err) => {
														if (err) return res.sendStatus(400);
														conn.query('INSERT INTO user_info(user_id, playlist_id, video_id, playlist_order, hidden, dotted) VALUES ?', [data], (err) => {
																if (err) return res.sendStatus(400);
																conn.query(`SELECT videos.* , dotted, hidden, playlist_order FROM videos LEFT JOIN user_info pd ON videos.id = pd.video_id AND videos.dead = 0 WHERE pd.playlist_id = ${playlist_id} AND pd.user_id = ${userId} AND pd.hidden = false ORDER BY pd.playlist_order`, (err, rows) => {
																		if (err) return res.sendStatus(400);
																		const videos = rows.map(({ id, gsvn, video_id, interface_link, video_title, description, video_type, video_author, video_length, episode_title, thumbnail, tags, gotags, category, author_img, author_link, dotted, hidden, playlist_order, sponsored, live_now, datePublish }) => ({
																				id: id,
																				gsvn : gsvn,
																				url: video_id,
																				interface: interface_link,
																				title: decodeString(video_title),
																				description,
																				type: video_type,
																				author: video_author,
																				thumb : thumbnail,
																				tags : tags, 
																				gotags : gotags, 
																				category : category,
																				author_img : author_img,
																				authorLink : author_link,
																				length: video_length,
																				dotted: dotted,
																				hidden: hidden,
																				order: playlist_order,
																				episode_title:episode_title,
																				sponsored : sponsored,
																				live_now : live_now,
																				datePublish : datePublish
																		}))
																		res.send({ success : true, videos });
																});
														})
												})
										}
										else {
												conn.query(`SELECT * FROM user_info WHERE user_id = ${userId} AND playlist_id = ${playlist_id}`, (err, rows) => {
														if (err) return res.sendStatus(400);
														const last_order = rows.length;
														const data = video_idxs.map((video_id, idx) => {
																return [userId, playlist_id, video_id, last_order + idx + 1, 0, 0];
														})
														conn.query('INSERT INTO user_info(user_id, playlist_id, video_id, playlist_order, hidden, dotted) VALUES ?', [data], (err) => {
																if (err) return res.sendStatus(400);
																conn.query(`SELECT videos.* , dotted, hidden, playlist_order FROM videos LEFT JOIN user_info pd ON videos.id = pd.video_id AND videos.dead = 0 WHERE pd.playlist_id = ${playlist_id} AND pd.user_id = ${userId} AND pd.hidden = false ORDER BY pd.playlist_order`, (err, rows) => {
																		if (err) return res.sendStatus(400);
																		const videos = rows.map(({ id, gsvn, video_id, interface_link, video_title, description, video_type, video_author, video_length, episode_title, thumbnail, tags, gotags, category, author_img, author_link, dotted, hidden, playlist_order, sponsored, live_now, datePublish }) => ({
																				id: id,
																				gsvn : gsvn,
																				url: video_id,
																				interface: interface_link,
																				title: decodeString(video_title),
																				description,
																				type: video_type,
																				author: video_author,
																				thumb : thumbnail,
																				tags : tags, 
																				gotags : gotags, 
																				category : category,
																				author_img : author_img,
																				authorLink : author_link,
																				length: video_length,
																				dotted: dotted,
																				hidden: hidden,
																				order: playlist_order,
																				episode_title:episode_title,
																				sponsored : sponsored,
																				live_now : live_now,
																				datePublish : datePublish
																		}))
																		res.send({ success : true, videos });
																});
														})
												})
										}
								}
						})
				})
		})
})

router.post('/removefromplaylist/:userId', (req, res) => {
	const { video_id, playlist_id } = req.body;
	const { userId } = req.params;
	console.log( video_id, playlist_id)
	req.getConnection((err, conn) => {
		if (err) return res.sendStatus(400);
		conn.query(`SELECT playlist_order FROM user_info WHERE video_id = '${video_id}' AND playlist_id = '${playlist_id}' AND user_id = '${userId}'`, (err, rows) => {
			if (err) return res.sendStatus(400);
			const order = rows[0].playlist_order;
			conn.query('UPDATE user_info SET playlist_order = playlist_order - 1 WHERE playlist_id = ? AND playlist_order > ? AND user_id = ?', [playlist_id, order, userId], (err) => {
				if (err) return res.sendStatus(400);
				conn.query('DELETE FROM user_info WHERE video_id = ? AND playlist_id = ? AND user_id = ?', [video_id, playlist_id , userId], (err) => {
					if (err) return res.sendStatus(400);
					conn.query(`SELECT videos.* , dotted, hidden, playlist_order FROM videos LEFT JOIN user_info pd ON videos.id = pd.video_id AND videos.dead = 0 WHERE pd.playlist_id = ${playlist_id} AND pd.user_id = ${userId} AND pd.hidden = false ORDER BY pd.playlist_order`, (err, rows) => {
						if (err) return res.sendStatus(400);
						const videos = rows.map(({ id, gsvn, video_id, interface_link, video_title, description, video_type, video_author, video_length, episode_title, thumbnail, tags, gotags, category, author_img, author_link, dotted, hidden, playlist_order, sponsored, live_now, datePublish }) => ({
							id: id,
							gsvn : gsvn,
							url: video_id,
							interface: interface_link,
							title: decodeString(video_title),
							description,
							type: video_type,
							author: video_author,
							thumb : thumbnail,
							tags : tags,
							gotags : gotags,
							category : category,
							author_img : author_img,
							authorLink : author_link,
							length: video_length,
							dotted: dotted,
							hidden: hidden,
							order: playlist_order,
							episode_title:episode_title,
							sponsored : sponsored,
							live_now : live_now,
							datePublish : datePublish
						}))
						res.send({ success : true, videos });
					});
				})
			})
		})
	})
});

router.post('/brokeVideo/:userId', (req, res) => {
	const { video_id, playlist_id } = req.body;
	const { userId } = req.params;
	var date = new Date();
	date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
	req.getConnection((err, conn) => {
		if (err) return res.sendStatus(400);
		conn.query(`SELECT playlist_order FROM user_info WHERE user_id = ${userId} AND playlist_id = ${playlist_id} AND video_id = ${video_id}`, (err, rows) => {
			if (err) return res.sendStatus(400);
			const playlist_order = rows[0]['playlist_order'];
			conn.query(`DELETE FROM user_info WHERE user_id = ${userId} AND playlist_id = ${playlist_id} AND video_id = ${video_id}`, (err) => {
				if (err) return res.sendStatus(400);
				conn.query(`UPDATE user_info SET playlist_order = playlist_order - 1 WHERE user_id = ${userId} AND playlist_id = ${playlist_id} AND playlist_order > ${playlist_order}`, (err) => {
					if (err) return res.sendStatus(400);
					conn.query(`UPDATE videos SET dead = 1, dateTimeReportDead = '${date}' WHERE id = ${video_id}`, (err) => {
						if (err) return res.sendStatus(400);
						res.send ({
							success : true
						});
					})
				})
			})
		})
	})
});

router.post('/hidefromplaylist/:userId', (req, res) => {
	 
		const { video_id, playlist_id, hideValue, hide_filter } = req.body;
		const { userId } = req.params;
		let token = req.headers['authorization'];
		var request = require('request');
		var url = `${process.env.REACT_APP_LOGIN_URL}/api/me`;
		var headers = { 
			Authorization: `${token}`
		};
		// request.get({ url: url,  headers: headers }, function (e, r, body) {
		//     if(!e && r.statusCode == 200) {
						req.getConnection((err, conn) => {
								if (err) return res.sendStatus(400);
								conn.query(`UPDATE user_info SET hidden = ${hideValue} WHERE video_id = ${video_id} AND playlist_id = ${playlist_id} AND user_id = ${userId}`, (err) => {
										if (err) return res.sendStatus(400);
										conn.query(`SELECT videos.* , dotted, hidden, playlist_order FROM videos LEFT JOIN user_info pd ON videos.id = pd.video_id AND videos.dead = 0 WHERE pd.playlist_id = ${playlist_id} AND pd.user_id = ${userId} AND IF (${hide_filter}, 1, pd.hidden = false) ORDER BY playlist_order`, (err, rows) => {
												if (err) return res.sendStatus(400);
												const videos = rows.map(({ id, gsvn, video_id, interface_link, video_title, description, video_type, video_author, video_length, episode_title, thumbnail, tags, gotags, category, author_img, author_link, dotted, hidden, playlist_order, sponsored, live_now, datePublish }) => ({
														id: id,
														gsvn : gsvn,
														url: video_id,
														interface: interface_link,
														title: decodeString(video_title),
														description,
														type: video_type,
														author: video_author,
														thumb : thumbnail,
														tags : tags, 
														gotags : gotags, 
														category : category,
														author_img : author_img,
														authorLink : author_link,
														length: video_length,
														dotted: dotted,
														hidden: hidden,
														order: playlist_order,
														episode_title:episode_title,
														sponsored : sponsored,
														live_now : live_now,
														datePublish : datePublish
												}))
												res.send({ videos });
										});
								})
						})
		//     }
		//     else {
		//         res.send({ status: 401, message: 'Unauthorized request!'});
		//     }
		// });
});

router.post('/hideUserItem/:userId', (req, res) => {
	 
	const { video_id, playlist_id, hideValue } = req.body;
	const { userId } = req.params;
	req.getConnection((err, conn) => {
			if (err) return res.sendStatus(400);
			conn.query(`UPDATE user_info SET hidden = ${hideValue} WHERE video_id = ${video_id} AND playlist_id = ${playlist_id} AND user_id = ${userId}`, (err) => {
				if (err) return res.sendStatus(400);
				res.send({ success: true });
			})
	})
});

router.post('/remove', (req, res) => {
		
		const { video_id } = req.body;
		let token = req.headers['authorization'];
		var request = require('request');
		var url = `${process.env.REACT_APP_LOGIN_URL}/api/me`;
		var headers = { 
			Authorization: `${token}`
		};
		// request.get({ url: url,  headers: headers }, function (e, r, body) {
		//     if(!e && r.statusCode == 200) {
						req.getConnection((err, conn) => {
								if (err) return res.sendStatus(400);
								conn.query('SELECT playlist_id, playlist_order FROM playlist_data WHERE video_id = ?', [video_id], (err, rows) => {
										if (err) return res.sendStatus(400);
										let completed = 0;
										if (rows.length > 0) {
												rows.map(row => {
														const { playlist_id, playlist_order } = row;
														conn.query('UPDATE playlist_data SET playlist_order = playlist_order - 1 WHERE playlist_id = ? AND playlist_order > ?',[playlist_id, playlist_order], (err) => {
																if (err) return res.sendStatus(400);
																completed ++;
																if (completed === rows.length) {
																		conn.query('DELETE FROM playlist_data WHERE video_id = ?', [video_id], (err) => {
																				if (err) return res.sendStatus(400);
																				conn.query('DELETE FROM videos WHERE id = ?', [video_id], (err) => {
																						if (err) return res.sendStatus(400);
																						res.send({
																								success: true
																						});
																				});
																		});
																}
														});
												})
										} else {
												conn.query('DELETE FROM videos WHERE id = ?', [video_id], (err) => {
														if (err) return res.sendStatus(400);
														res.send({
																success: true
														});
												});
										}
								})
						})
		//     }
		//     else {
		//         res.send({ status: 401, message: 'Unauthorized request!'});
		//     }
		// });
});

router.post('/searchVideo/:userId', (req, res) => {
		const { value, position } = req.body;
		req.getConnection((err, conn) => {
				if (err) return res.sendStatus(400);
				positionCheck((position), (filterPosition) => {
						conn.query(`SELECT * FROM videos WHERE IF ('${value}'!= "", CONCAT(${filterPosition}) LIKE "%${value}%", 1) `, (err, rows) => {
								if (err) return res.sendStatus(400);
								const videos = rows.map(({ id, gsvn, video_id, interface_link, video_title, description, video_type, video_author, video_length, thumbnail, tags, gotags, category, author_img, author_link}) => ({
										checked : 0,
										id: id,
										gsvn : gsvn,
										url: video_id,
										interface_link: interface_link,
										video_title: decodeString(video_title),
										description,
										video_type: video_type,
										video_author: video_author,
										thumb : thumbnail,
										tags : tags, 
										gotags : gotags, 
										category : category,
										author_img : author_img,
										authorLink : author_link,
										video_length: video_length,
								}))
								res.send({ videos });
								});
				})
		})
})

const filterCheck = (types, callback) => {
		let filterTypes = "";
		if(types[0].checked === 1) {
				filterTypes = 1;
				callback(filterTypes);
		}
		else {
				types = types.slice(1, types.length);
				types.map((type, idx) => {
						if(type.checked === 1) {
								filterTypes += `video_type = '${type.label}' OR `;
						}
						if(idx === (types.length - 1) ) {
								filterTypes = filterTypes.slice(0, filterTypes.length - 3);
						}
				})
				callback(filterTypes);
		}
}

const positionCheck = (position, callback) => {
		let filterPosition = "";
		if(position[0].checked === 1) {
				filterPosition = `CONCAT(video_type, '', video_title, '', description, '', video_author)`;
				callback(filterPosition);
		}
		else {
				position.map((type, idx) => {
						if(type.checked === 1) {
								if(type.label === 'Title')
										filterPosition += "video_title, '',";
								else if(type.label === 'Description')
										filterPosition += "description, '',";
								else if(type.label === 'Author')
										filterPosition += "video_author, '',";
								else if(type.label === 'Tags')
										filterPosition += "tags, '',";
						}
						if(idx === (position.length - 1) ) {
								filterPosition = filterPosition.slice(0, filterPosition.length - 5);
						}
				})
				callback(filterPosition);
		}

} 

module.exports = router;
