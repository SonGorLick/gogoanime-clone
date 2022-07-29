                        <nav class="menu_recent">
                          <ul>
                          <?php
                            $json = file_get_contents("$apiLink/getRecent/1");
                            $json = json_decode($json, true);
                            foreach($json as $recentRelease)  { 
                           ?>
                            <li>
                              <a href="/<?=$recentRelease['animeLink']?>" title="<?=$recentRelease['name']?>">
                                <div class="thumbnail-recent"
                                  style="background: url('<?=$recentRelease['imgUrl']?>');"></div>
                                  <?=$recentRelease['name']?>
                              </a>
                              <a href="/<?=$recentRelease['animeLink']?>" title="<?=$recentRelease['name']?>">
                                <p class="time_2"><?=$recentRelease['episodeNum']?></p>
                              </a>
                            </li>
                          <?php } ?>
                          </ul>
                        </nav>