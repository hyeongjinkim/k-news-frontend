<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:template match="/">
    <html>
      <head>
        <title>oppagram Sitemap</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          h1 { color: #333; }
          table { border-collapse: collapse; width: 100%; margin-top: 20px; }
          th { background: #f0f0f0; padding: 10px; text-align: left; }
          td { padding: 8px; border-bottom: 1px solid #ddd; }
          tr:hover { background: #f9f9f9; }
          .priority { text-align: center; }
          .high { color: #d9534f; font-weight: bold; }
          .medium { color: #f0ad4e; }
          .low { color: #5bc0de; }
        </style>
      </head>
      <body>
        <h1>oppagram XML Sitemap</h1>
        <p>Total URLs: <xsl:value-of select="count(//s:url)"/></p>
        <table>
          <tr>
            <th>URL</th>
            <th>Last Modified</th>
            <th>Change Frequency</th>
            <th class="priority">Priority</th>
          </tr>
          <xsl:for-each select="//s:url">
            <tr>
              <td><xsl:value-of select="s:loc"/></td>
              <td><xsl:value-of select="substring(s:lastmod, 1, 10)"/></td>
              <td><xsl:value-of select="s:changefreq"/></td>
              <td class="priority">
                <xsl:attribute name="class">
                  <xsl:choose>
                    <xsl:when test="s:priority &gt;= 0.8">high</xsl:when>
                    <xsl:when test="s:priority &gt;= 0.5">medium</xsl:when>
                    <xsl:otherwise>low</xsl:otherwise>
                  </xsl:choose>
                </xsl:attribute>
                <xsl:value-of select="s:priority"/>
              </td>
            </tr>
          </xsl:for-each>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>